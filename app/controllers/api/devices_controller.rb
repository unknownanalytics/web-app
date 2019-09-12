class Api::DevicesController < Api::ApiController
  def index
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
end
