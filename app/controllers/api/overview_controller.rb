class Api::OverviewController < Api::ApiController
  def index
    period_range = get_date_range
    # countries


    # browser
    campaigns = PageView.select('count(distinct utm_campaign)')
                    .where.not(:utm_campaign => nil)
                    .joins(:page => :domain)
                    .where(:pages => {:domain => current_domain})

    campaigns = campaigns.as_json(except: :id)[0]['count']

    # referers
    referers = PageView.select('count(distinct referer)')
                   .where.not(:referer => nil)
                   .joins(:page => :domain)
                   .where(:pages => {:domain => current_domain})

    referers = referers.as_json(except: :id)[0]['count']


    # browser
    browsers = PageView.select('count(distinct browser)')
                   .where.not(:browser => nil)
                   .joins(:page => :domain)
                   .where(:pages => {:domain => current_domain})

    browsers = browsers.as_json(except: :id)[0]['count']



    reply_json({
                   interval: period_range,
                   stats: {
                       views: current_domain.page_views.count,
                       referers: referers,
                       campaigns: campaigns,
                       devices: browsers
                   }
               })
  end

  def top_pages
    period_range = get_date_range
    limit = params[:limit] || 10
    pages = Page
                .joins(:domain)
                .where(:domains => {:id => current_domain.id})
                .joins(:page_views)
                .where(:page_views => {:created_at => period_range})
                .select("pages.id, pages.url, count(page_views.page_id) as vcount")
                .group("pages.id")
                .limit(limit)
                .order("vcount DESC")

    pages_top_views = pages.map do |record|
      record.attributes.merge(
          :vcount => record.vcount
      )
    end

    reply_json({
                   views: pages_top_views,
                   interval: period_range
               })

  end

end
