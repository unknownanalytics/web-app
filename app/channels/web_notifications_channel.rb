class WebNotificationsChannel < ApplicationCable::Channel
  def subscribed
    stream_for "4"
  end
end