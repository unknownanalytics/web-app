require "browser"

class Api::Sdk::V1::CollectController < Api::ApiController
  before_action :set_access_control_headers
  before_action :parse_body
  before_action :check_api_key_exists
  before_action :set_key
  before_action :check_and_set_domain
  before_action :check_allowed_origins
  protect_from_forgery unless: -> { request.format.json? }
  after_action -> { request.session_options[:skip] = true }

  @api_key
  @body
  @domain
  @page

  def index
    begin
      url = @body["url"]
      uri = URI(url)
      uri.scheme
      #=> "http"
      uri.host
      #=> "foo.com"
      uri.path
      #=> "/posts"
      uri.query
      #=> "id=30&limit=5"
      uri.fragment
      #=> "time=1305298413"
      @page = Page.where(:domain_id => @domain, :url => url).first_or_create!
      @page.update!(fragment = uri.fragment, path = uri.path, query = uri.query, host = uri.host)
      create_page_view
      if domain.domain_setting.track_geo
        create_page_view_location(page)
      end
      reply_json({ :ok => true })
    rescue StandardError => err
      reply_json({ :ok => false })
    end

  end

  def create_page_view
    begin
      utm = @body['utm']
      url = URI(@body['url'])
      browser_info = @body['browser']
      browser = Browser.new(request.user_agent, accept_language: "en-us")
      PageView.create!(:page => @page,
                       :utm_source => utm['src'],
                       :utm_medium => utm['medium'],
                       :utm_campaign => utm['name'],
                       :utm_content => utm['content'],
                       :is_mobile => browser.device.mobile?,
                       :is_desktop => browser.device.mobile?,
                       :is_tablet => browser.device.tablet?,
                       :utm_term => utm['term'],
                       :query => url.query,
                       :referer => request.referer,
                       :origin => request.origin,
                       :width_resolution => browser_info['ww'],
                       :height_resolution => browser_info['hw'])

    rescue StandardError => err
      reply_json({ :ok => false })
    end
  end

  def create_page_view_location(page)
    record = $maxmind.lookup(request.remote_ip)
    if record.found?
      country_iso_2 = record.country.iso_code
      PageViewLocation.create!({ :domain_id => @domain, :page => page, :country_iso_2 => country_iso_2 })
    end
  end

  protected

  def set_access_control_headers
    headers['Access-Control-Allow-Origin'] = '*'
  end

  def check_and_set_domain
    pub_key = ApiKey.where({ :public_key => @api_key }).includes(domain: :domain_setting).first
    unless pub_key
      return reply_json({ :error => "Verify key" }, :bad_request)
    end
    @domain = pub_key.domain
  end

  def check_allowed_origins
    referer = request.referer
    origin = request.origin
    allowed_origin = @domain.domain_setting.origins.split(',')
    # check with trail stash
    #
    allow = allowed_origin.include?(origin) or
      allowed_origin.include?(referer) or
      allowed_origin.include?(origin.delete_suffix('/')) or
      allowed_origin.include?(referer.delete_suffix('/'))
    unless allow
      reply_json({ :error => "Not an origin allowed" }, :bad_request)
    end

  end

  def check_api_key_exists
    %w(token url).each do |k|
      unless @body.has_key?(k)
        reply_json({ :error => "Invalid params" }, :bad_request)
        break
      end
    end
  end

  def parse_body
    @body = JSON.parse(request.raw_post)
  end

  def set_key
    @api_key = @body["token"]
  end
end

=begin
package api

import (
           "unknown-api/models"
"github.com/jinzhu/gorm"
"encoding/json"
"net/http"
"time"
"log"
"fmt"
"github.com/sirupsen/logrus"

"unknown-api/tools/geo-db"
"unknown-api/tools/interfaces"
"unknown-api/tools/http_helper"
"unknown-api/tools"
"strconv"
"bytes"
)

// query for looking in api keys
           var DomainByPublicKeyWhereQuery = "domain_id = ?"
           // query for looking by id
                      var ById = "id = ?"
// query for looking by full url
var PageByFullUrl = "full_url = ?"
var PageByIsTest = "is_test = ?"

// getDomainAndDomainSettings retrieve a domain setting for a given domain
           func GetDomainAndDomainSettings(domainId uint) (int, string, models.DomainSetting, models.Domain) {
               var domainSetting models.DomainSetting
           var domain models.Domain
           errDomainString := models.GetDB().Where(DomainByPublicKeyWhereQuery, domainId).Find(&domainSetting)
           errDomain := models.GetDB().Where(ById, domainId).Find(&domain)
           errorString := ""
           status := 0
           // check domain
           if errDomain.Error != nil {
               if gorm.IsRecordNotFoundError(errDomain.Error) {
                 errorString = "Unexpected error"
                 status = http.StatusNotFound

               } else {
                   errorString = http_helper.ERROR_SERVER
               status = http.StatusInternalServerError
               }
               }
               // check for domain settings
                          if errDomainString.Error != nil {
                              if gorm.IsRecordNotFoundError(errDomainString.Error) {
                                errorString = "Unexpected error"
                                status = http.StatusNotFound

                              } else {
                                  errorString = http_helper.ERROR_SERVER
                              status = http.StatusInternalServerError
                              }
                              }

                              return status, errorString, domainSetting, domain
                              }

                              //  v Create page for a given uri string
                                                  func CreateIfNotExistPage(domainId uint, uri string, isTest bool) (*gorm.DB, uint) {
                                                      var page models.Page
                                                  err := models.GetDB().Where(PageByFullUrl, uri).Where(PageByIsTest, isTest).Find(&page)
                                                  if err.Error != nil {
                                                      if gorm.IsRecordNotFoundError(err.Error) {
                                                        page.DomainId = domainId
                                                        page.FullUrl = uri
                                                        page.IsTest = isTest
                                                        page.CreatedAt = time.Now()
                                                        page.CreatePage()
                                                        err.Error = nil
                                                      }
                                                        }
                                                        return err, page.ID
                                                        }

                                                        // createPageView Creates a new view for a given page id.
                                                            func CreatePageView(pageId uint, data interfaces.RequestViewData, isTest bool, request *http.Request) (*gorm.DB) {
                                                            var pageView models.PageView
                                                        pageView.PageId = pageId
                                                        // add sandbox verify
                                                        pageView.IsTest = isTest
                                                        pageView.CreatedAt = time.Now()

                                                        ua := http_helper.ParseUserAgent(request.UserAgent())
                                                        browserName, _ := ua.Browser()
                                                        pageView.Browser = browserName
                                                        metadata, _ := json.Marshal(data.Utm)
                                                        pageView.Metadata = metadata

                                                        pageView.HeightResolution = data.Browser.Wh
                                                        pageView.WidthResolution = data.Browser.Ww

                                                        isMobile := ua.Mobile()
                                                        pageView.IsMobile = isMobile

                                                        pageView.CreatePageView()

                                                        // check if page created
                                                        if pageView.ID != 0 {
                                                            var page models.Page
                                                        err := models.GetDB().Where(ById, pageId).Find(&page)
                                                        if err.Error != nil {
                                                            log.Panic("Erorr getting page page")
                                                        return err
                                                        }
                                                        page.PageViewsCount++
                                                        page.UpdatePage()
                                                        }
                                                        return nil
}

      // getDomainAndDomainSettings retrieve a domain setting for a given domain
                                                                func CreatePageError(pageId uint, data interfaces.RequestErrorData, request *http.Request) (*gorm.DB) {
                                                                    var pageError models.PageError
                                                                pageError.PageId = pageId
                                                                pageError.CreatedAt = time.Now()

                                                                ua := http_helper.ParseUserAgent(request.UserAgent())
                                                                browserName, _ := ua.Browser()
                                                                pageError.Browser = browserName
                                                                metadata, _ := json.Marshal(data.Utm)
                                                                pageError.Metadata = metadata

                                                                isMobile := ua.Mobile()
                                                                pageError.IsMobile = isMobile

                                                                pageError.CreatePageError()

                                                                // check if page  error created
                                                                if pageError.ID != 0 {
                                                                    var page models.Page
                                                                err := models.GetDB().Where(ById, pageId).Find(&page)
                                                                if err.Error != nil {
                                                                    log.Panic("Erorr getting page page")
                                                                return err
                                                                }
                                                                page.PageViewsCount++
                                                                page.UpdatePage()
                                                                }
                                                                return nil
                                                                }

                                                                // When this features is active, we create
                                                                func CreatePageScreen(pageId uint, uri string) {

                                                                  screenShotRemoteUrl := tools.GetEnvironment().ScreenShotUri
                                                                  screenShotSecretKey := tools.GetEnvironment().ScreenShotSecretKey
                                                                  logrus.Info("about to create a new scrren shot for " + screenShotRemoteUrl)
                                                                  requestBody, err := json.Marshal(map[string]string{
                                                                    "page_id":   strconv.FormatUint(uint64(pageId), 10),
                                                                        "page_url":  uri,
                                                                    "app_token": screenShotSecretKey,
                                                                  })
                                                                  if err != nil {
                                                                      logrus.Fatal("Body error ")
                                                                  }
                                                                  resp, err := http.Post(screenShotRemoteUrl, "application/json", bytes.NewBuffer(requestBody))
                                                                  if err != nil {
                                                                      logrus.Error("screen shooter response is Not OK ")
                                                                  logrus.Error(err)
                                                                  }
                                                                  if resp != nil {
                                                                      // Print the HTTP Status Code and Status Name
                                                                  fmt.Println("HTTP Response Status:", resp.StatusCode, http.StatusText(resp.StatusCode))

                                                                  if resp.StatusCode >= 200 && resp.StatusCode <= 299 {
                                                                      fmt.Println("HTTP Status is in the 2xx range")
                                                                  } else {
                                                                      fmt.Println("Argh! Broken")
                                                                  }
                                                                  }
                                                                  }

                                                                  // When geo track is enabled, we create a geo lookup from request ip@address
                                                                  func CreatePageViewGeoIPLocation(pageId uint, request *http.Request) {
                                                                    var remoteAddr = request.RemoteAddr
                                                                    // validate remote @
                                                                    if remoteAddr != "" && request.Host != "localhost:8000" {
                                                                        logrus.Info(request.RemoteAddr)
                                                                    err, result := geo_db.ParseIp(request.RemoteAddr)
                                                                    if err != nil {
                                                                        logrus.Error(err)
                                                                    }
                                                                    dbRecord := models.PageViewLocation{
                                                                          CreateAt: time.Now(),
                                                                              PageId:   pageId,
                                                                              Country:  result.Country.ISOCode,
                                                                              CityName: result.City.Names["en"],
                                                                              UUID:     fmt.Sprint(result.City.GeoNameID),
                                                                        }
                                                                    dbRecord.CreatePageViewLocation()
                                                                    } else {
                                                                        logrus.Error("We can't Geo track a localhost request ")
                                                                    }
                                                                    }
=end
