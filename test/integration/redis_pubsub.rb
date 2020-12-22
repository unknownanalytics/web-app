# usage:
# ruby pub.rb channel username

require 'rubygems'
require 'redis'
require 'json'

$redis = Redis.new({url: "redis://127.0.0.1:6379/0"})

data = {"user" => ARGV[1]}
# channel = "unknown_analytics_redis_notifications_development:web_notifications:4"
channel = "UNK_ANA_SCREENSHOT_REDIS_CHANNEL_FINISH"
puts (channel)
loop do
  msg = STDIN.gets
  $redis.publish channel, data.merge('msg' => msg.strip).to_json
end