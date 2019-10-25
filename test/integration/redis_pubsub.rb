# usage:
# ruby pub.rb channel username

require 'rubygems'
require 'redis'
require 'json'

$redis = Redis.new

data = {"user" => ARGV[1]}
channel = "unknown_analytics_development:web_notifications:4"
puts (channel)
loop do
  msg = STDIN.gets
  $redis.publish channel, data.merge('msg' => msg.strip).to_json
end