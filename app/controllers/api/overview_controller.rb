class Api::OverviewController < Api::ApiController
  def index
    period_range = get_date_range
    # countries

    if current_domain.domain_setting.track_geo
      page_view_locations = 'page_view_locations'
      geo = PageViewLocation
                .select("count(#{page_view_locations}.country_iso_2) as val , #{page_view_locations}.country_iso_2 as iso")
                .group("#{page_view_locations}.country_iso_2")
                .joins(:page => :domain)
                .where(:pages => {:domain => current_domain})


      geo = geo.as_json(except: :id)
    else
      geo = null
      reply_json({
                     interval: period_range,
                     geo: geo
                 })
    end
    reply_json({
                   interval: period_range,
                   overview: {
                       geo: geo,
                   },
                   stats: {
                       viewsCount: current_domain.page_views.count,
                       sessionsCount: 300,
                       eventsCount: 23,
                       issuesCount: 233
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
                .select("pages.id, pages.full_url, count(page_views.page_id) as vcount")
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
