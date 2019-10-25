class WebNotificationsChannel < ApplicationCable::Channel
  def subscribed
    stream_for "4"
    #stream_for "#{current_user.id}"
  end
end