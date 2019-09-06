module Dashboard
  class StatsController < Dashboard::DashboardController

    before_action :check_format

    def overview
      respond_to do |format|
        format.json do
          render :json => {
              data: {
                  viewsCount: current_domain.page_views.count,
                  sessionsCount: 300,
                  eventsCount: 23,
                  issuesCount: 233
              }
          }
        end
      end
    end


    def pages
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

      respond_to do |format|
        format.json do
          render :json => {
              data: {
                  page_views: pages_top_views,
                  interval: period_range
              }
          }
        end
      end
    end

    def devices
      period_range = get_date_range
      views = PageView
                  .select("page_views.is_mobile, page_views.is_desktop, page_views.browser, page_views.is_tablet")
                  .joins(:page => :domain)
                  .where(:created_at => period_range)
                  .where(:domains => {:id => current_domain.id})

      result_views = views.map do |record|
        record.attributes
      end

      respond_to do |format|
        format.json do
          render :json => {
              data: {
                  page_views: result_views,
                  interval: period_range
              }
          }
        end
      end

    end

    def summary
      r = PageView
              .where(:created_at => 15.days.ago.in_time_zone(Time.zone)..Time.zone.now)
              .select('Count(page_views.id),  pages.id as page_id, pages.full_url')
              .group('pages.id', :page_id)
              .joins(:page => :domain)
              .where(:pages => {:domain => current_domain})


      respond_to do |format|
        format.json do
          render :json => {
              data: {
                  views: r
              }
          }
        end
      end
    end


    def page

      #select  COUNT(p.id) , p.id as page_id , p.full_url from page_views left outer join pages p on page_views.page_id = p.id group by p.id;


    end


    private

    def check_format
      return if request.format == :json
      respond_to do |format|
        format.html {render :index}
      end
    end


    def get_date_range
      # @count_in_month = PageView.where(:created_at => 1.month.ago.in_time_zone(Time.zone)..Time.zone.now).joins(:page => :domain).where(:domains => {:id => current_user.own_domains}).count
      # default period month
      interval = params[:interval] || 'month'
      stop = Time.now + 1.day
      if params[:start].present?
        stop = params[:start].to_s
      end

      if interval == 'day'
        start = stop - 1.days
      elsif interval === 'week'
        start = stop - 1.week
      else
        # monthly
        start = stop - 1.month
      end
      start..stop
    end

  end
end