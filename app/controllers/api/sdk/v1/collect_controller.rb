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
      endpoint = @body['endpoint']
      uri = URI(full_url)
      # create current page if not exists already
      @page = Page.where(:domain_id => @domain, :url => uri.path).first_or_create
      @page.update!(:fragment => uri.fragment, :path => uri.path, :full_url => full_url, :query => uri.query, :host => uri.host)

      case endpoint
      when "error"
        create_page_error
      when 'view'
        create_page_view
      else
        create_page_view
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

  def create_page_error
    puts '%%%%%'
    puts @body['info']
    begin
      browser = DeviceDetector.new(request.user_agent)
      # puts '***************** browser.device ******************'
      # puts browser.name # => 'Chrome'
      # puts browser.full_version # => '30.0.1599.69'
      # puts browser.os_name # => 'Windows'
      # puts browser.os_full_version # => '8'
      # # For many devices, you can also query the device name (usually the model name)
      # puts browser.device_name # => 'iPhone 5'
      # # Device types can be one of the following: desktop, smartphone, tablet, console,
      # # portable media player, tv, car browser, camera
      # puts browser.device_type # => 'smartphone'
      PageError.create!(:page => @page,
                        :is_mobile => browser.device_type === "smartphone",
                        :is_desktop => browser.device_type === "desktop",
                        :is_tablet => browser.device_type === "tablet",
                        :user_agent => browser.device_name,
                        :browser => browser.name,
                        :metadata => {
                          :os => browser.os_name,
                          :device => browser.device_type,
                          :info => @body['info']
                        })
    rescue StandardError => err
      reply_json({ :ok => false })
    end
  end

  def create_page_view
    begin
      utm = @body['utm']
      url = URI(@body['url'])
      browser_info = @body['browser']
      browser = DeviceDetector.new(request.user_agent)
      # puts '***************** browser.device ******************'
      # puts browser.name # => 'Chrome'
      # puts browser.full_version # => '30.0.1599.69'
      # puts browser.os_name # => 'Windows'
      # puts browser.os_full_version # => '8'
      # # For many devices, you can also query the device name (usually the model name)
      # puts browser.device_name # => 'iPhone 5'
      # # Device types can be one of the following: desktop, smartphone, tablet, console,
      # # portable media player, tv, car browser, camera
      # puts browser.device_type # => 'smartphone'
      PageView.create!(:page => @page,
                       :utm_source => utm['src'],
                       :utm_medium => utm['medium'],
                       :utm_campaign => utm['name'],
                       :utm_content => utm['content'],
                       #  :platform => browser.platform.name,
                       :is_mobile => browser.device_type === "smartphone",
                       :is_desktop => browser.device_type === "desktop",
                       :is_tablet => browser.device_type === "tablet",
                       :utm_term => utm['term'],
                       :query => url.query,
                       :referer => request.referer,
                       :origin => request.origin,
                       :browser => browser.name,
                       :width_resolution => browser_info['ww'],
                       :height_resolution => browser_info['hw'])

      if @domain.domain_setting.track_geo
        create_page_view_location
      end

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
      reply_json({ :error => "Not an origin allowed", :origins => allowed_origins, :origin => request.origin, :referer => request.referer }, :bad_request)
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