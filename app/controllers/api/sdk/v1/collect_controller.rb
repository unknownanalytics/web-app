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
      full_url = @body['url']
      uri = URI(full_url)
      @page = Page.where(:domain_id => @domain, :url => uri.path).first_or_create
      @page.update!(:fragment => uri.fragment, :path => uri.path, :full_url => full_url, :query => uri.query, :host => uri.host)
      create_page_view
      if @domain.domain_setting.track_geo
        create_page_view_location
      end
      puts "replying ok"
      reply_json({ :ok => true })
    rescue StandardError => err
      puts "StandardError"
      puts "################################################"
      puts err
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
                       :is_desktop => !(browser.device.mobile? || browser.device.tablet?),
                       :is_tablet => browser.device.tablet?,
                       :utm_term => utm['term'],
                       :query => url.query,
                       :referer => request.referer,
                       :origin => request.origin,
                       :browser => browser.device.name,
                       :width_resolution => browser_info['ww'],
                       :height_resolution => browser_info['hw'])

    rescue StandardError => err
      reply_json({ :ok => false })
    end
  end

  def create_page_view_location
    puts "request.remote_ip"
    puts request.remote_ip
    record = $maxmind.lookup(request.remote_ip)
    if record.found?
      country_iso_2 = record.country.iso_code
      PageViewLocation.create!({ :page => @page, :country_iso_2 => country_iso_2 })
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

    allowed_origins = @domain.domain_setting.origins.split(',')
    uri_origin = URI(origin)
    origin = uri_origin.host

    if origin.include?('localhost') or origin.include?('127.0.0.1')
      origin = [origin, uri_origin.port].join(':')
    end

    puts '#######'
    puts 'origin'
    puts origin
    puts '#######'

    puts '#######'
    puts 'allowed_origin'
    puts allowed_origins
    puts '#######'
    # check with trail stash
    #
    allow = allowed_origins.include?(origin) or
      allowed_origins.include?(referer) or
      allowed_origins.include?(origin.delete_suffix('/')) or
      allowed_origins.include?(referer.delete_suffix('/'))
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