class WebNotificationsChannel < ApplicationCable::Channel
  def subscribed
    stream_for "#{ENV['UNK_ANA_WEB_NOTIFICATION_CHANNEL']}:#{current_user.id}"
  end
end