class Api::SummaryController < Api::ApiController
  def index
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
end
