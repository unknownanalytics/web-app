module Dashboard
  class NotificationsController < Dashboard::DashboardController

    def index
    end

    ## FUTURE_USAGE
    def notify
      data = {:msg => "ok"}
      NotificationJob.perform_now(data, nil)
      render json: data
    end

  end
end
