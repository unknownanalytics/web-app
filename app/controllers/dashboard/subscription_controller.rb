module Dashboard
  class SubscriptionController < Dashboard::DashboardController

    def index
      @count_in_month = PageView.where(:created_at => 1.month.ago.in_time_zone(Time.zone)..Time.zone.now).joins(:page => :domain).where(:domains => {:id => current_user.own_domains}).count
    end

  end
end
