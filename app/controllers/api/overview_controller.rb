class Api::OverviewController < Api::ApiController
  def index
    period_range = get_date_range
    # countries

    if current_domain.domain_setting.track_geo
      page_view_locations = 'page_view_locations'
      geo = PageViewLocation
                .select("count(#{page_view_locations}.country_iso_2) as c , #{page_view_locations}.country_iso_2 as iso")
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


end
