class WebNotificationsChannel < ApplicationCable::Channel
  def subscribed
    stream_for "dashboard_notification:#{current_user.id}"
  end
end