class NotificationJob < ApplicationJob
  def perform(data, user)
    $redis.publish "track-web_development:events", data.to_json
  end
end
