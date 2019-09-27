class Api::DevicesController < Api::ApiController
  def index
    # https://www.postgresql.org/message-id/COL112-W2F30A7298763974CD9E088A370@phx.gbl
    period_range = get_date_range
    views = PageView
                .select("
       sum(case when is_mobile then 1 else 0 end) as mobile,
       sum(case when is_desktop then 1 else 0 end) as desktop,
       sum(case when is_tablet then 1 else 0 end) as tablet,
       sum(case when is_tablet or is_desktop or is_mobile then 0 else 1 end) as unknown,
       count(*) as total")
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
