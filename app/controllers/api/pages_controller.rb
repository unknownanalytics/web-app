class Api::PagesController < Api::ApiController

  def index
    period_range = get_date_range
    pages = Page
                .joins(:domain)
                .where(:domains => {:id => current_domain.id})
                .joins(:page_views)
                .where(:page_views => {:created_at => period_range})
                .select("pages.id, pages.full_url, count(page_views.page_id) as vcount")
                .group("pages.id")
                .limit(10)
                .order("vcount DESC")

    pages_top_views = pages.map do |record|
      record.attributes.merge(
          :vcount => record.vcount
      )
    end

    reply_json({
                   page_views: pages_top_views,
                   interval: period_range
               })

  end

  def summary
    period_range = get_date_range
    # countries
    pages = Page.where(:domain_id => current_domain.id)
    # utms
    utms = PageView.select('count(case when utm_source is null then 1 ELSE 1 end), page_views.utm_source')
               .group( :utm_source)
               .joins(:page => :domain)
               .where(:pages => {:domain => current_domain})

    # browser
    browsers = PageView.select('count(case when browser is null then 1 ELSE 1 end), page_views.browser')
                   .group(:browser)
                   .joins(:page => :domain)
                   .where(:pages => {:domain => current_domain})


    # browser
    origins = PageView.select('count(case when origin is null then 1 ELSE 1 end), page_views.origin')
                  .group(:origin)
                  .joins(:page => :domain)
                  .where(:pages => {:domain => current_domain})

    views = PageView.select('date(page_views.updated_at), count(page_views.updated_at)')
                .group("date(page_views.updated_at)")
                .joins(:page => :domain)
                .where(:pages => {:domain => current_domain})

    reply_json({
                   interval: period_range,
                   pages: pages,
                   utms: utms,
                   browsers: browsers,
                   views: views,
                   origins: origins
               })
  end

  def page_details
    period_range = get_date_range
    pages = Page.where("full_url like ?", "%#{params[:query]}%")
                .select([:id, :full_url])
                .joins(:domain)
                .where(:domains => {:id => current_domain.id})


    reply_json({
                   interval: period_range,
                   pages: pages
               })
  end


  def views_with_referrals

    period_range = get_date_range

    pages = Page
                .joins(:domain)
                .where(:domains => {:id => current_domain.id})
                .joins(:page_views)
                .where.not(:page_views => {:utm_source => nil})
                .where(:page_views => {:created_at => period_range})
                .select("pages.id, pages.full_url, page_views.utm_source, count(page_views.page_id) as vcount")
                .group("pages.id")
                .group("page_views.utm_source")
                .limit(10)
                .order("vcount DESC")

    pages_top_views = pages.map do |record|
      record.attributes.merge(
          :vcount => record.vcount
      )
    end

    reply_json({
                   page_views: pages_top_views,
                   interval: period_range
               })

  end


  def views_details
    r = PageView
            .where(:created_at => 6.month.ago.in_time_zone(Time.zone)..Time.zone.now)
            .select('Count(page_views.id), page_views.utm_source,  pages.id as page_id, pages.full_url')
            .group('pages.id', :page_id)
            .group('page_views.utm_source', :utm_source)
            .joins(:page => :domain)
            .where(:pages => {:domain => current_domain})
            .where.not(:page_views => {:utm_source => nil})
    reply_json({views: r})
  end
end
