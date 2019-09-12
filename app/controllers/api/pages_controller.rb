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

  def with_refferals

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

  def details
    r = PageView
            .where(:created_at => 15.days.ago.in_time_zone(Time.zone)..Time.zone.now)
            .select('Count(page_views.id), page_views.utm_source,  pages.id as page_id, pages.full_url')
            .group('pages.id', :page_id)
            .group('page_views.utm_source', :utm_source)
            .joins(:page => :domain)
            .where(:pages => {:domain => current_domain})
            .where.not(:page_views => {:utm_source => nil})
    reply_json({views: r})
  end
end
