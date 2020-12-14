class Api::PagesController < Api::ApiController
  def summary
    pages = Page.where(:domain_id => current_domain.id).select(:id, :full_url)
    # utms
    utms = PageView.select('count(case when utm_source is null then 1 ELSE 1 end), page_views.utm_source')
               .group(:utm_source)
               .joins(:page => :domain)
               .where(:pages => {:domain => current_domain})

    # browser
    browsers = PageView.select('count(case when browser is null then 1 ELSE 1 end), page_views.browser')
                   .group(:browser)
                   .joins(:page => :domain)
                   .where(:pages => {:domain => current_domain})


    # origins
    origins = PageView.select('count(case when origin is null then 1 ELSE 1 end), page_views.origin')
                  .group(:origin)
                  .joins(:page => :domain)
                  .where(:pages => {:domain => current_domain})



    reply_json({
                   pages: pages,
                   utms: utms,
                   browsers: browsers,
                   origins: origins
               })
  end


  def views
    period_range = get_date_range
    page_id = params[:page_id]
    pages = Page


    sql_select = "distinct TO_CHAR(date_trunc('day', page_views.created_at), 'YYYY-MM-DD') as t, count(*) as v"
    sql_group = "1"

    if page_id
      pages = pages.where(:id => page_id)
    end

    pages = pages.joins(:domain)
                .where(:domains => {:id => current_domain.id})
                .joins(:page_views)
                .where(:page_views => {:created_at => period_range})
                .select(sql_select)
                .group(sql_group)
                .order("1 DESC")
# TODO add period

=begin
    pages_top_views = pages.map do |record|
      record.attributes.merge(
          :date => record.day
      )
    end
=end

    reply_json({
                   views: pages.as_json(except: :id),
                   interval: period_range
               })

  end

  def heatmap
    period_range = get_date_range
    page_id = params[:page_id]
    by = params[:by]
    formats = {
        "week" => "IYYY-IW",
        "day" => "YYYY-MM-DD",
        "month" => "YYYY-MM",
        "hour" => "YYYY-MM-DD HH24-ID"
    }

    unless formats.keys.include?(by)
      return reply_json({ok: false}, :bad_request)
    end
    pages = Page

    sql_select = "distinct TO_CHAR(date_trunc('#{by}', page_views.created_at), '#{formats[by]}') as t, count(*) as v"
    sql_group = "1"

    if page_id
      pages = pages.where(:id => page_id)
    end

    pages = pages.joins(:domain)
                .where(:domains => {:id => current_domain.id})
                .joins(:page_views)
                .where(:page_views => {:created_at => period_range})
                .select(sql_select)
                .group(sql_group)
                .order("1 DESC")

    reply_json({
                   views: pages.as_json(except: :id),
                   interval: period_range
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

  def views_details_only_utms
    puts('###############""')
    puts(:page_id)
    puts('###############""')
    r = PageView
            .where(:created_at => 6.month.ago.in_time_zone(Time.zone)..Time.zone.now)
            .select('Count(page_views.id), page_views.utm_source,  pages.id as page_id, pages.full_url')
            .group('pages.id', :page_id)
            .joins(:page => :domain)
            .where(:pages => {:domain => current_domain})
            .where.not(:page_views => {:utm_source => nil})
    reply_json({views: r})
  end

  def page_views_details
    page_id = params[:page_id]
    period = get_date_range
    puts('###############""')
    puts(period)
    puts('###############""')
    r = PageView
            .select('Count(page_views.id), pages.id as page_id, pages.full_url')
            .group('pages.id', :page_id)
            .where(:created_at => period)
            .joins(:page => :domain)
            .where(:pages => {:id => page_id})
    #.where(:pages => {:domain => current_domain, :id => page_id})
    reply_json({views: r})
  end
end