# usage:
# ruby pub.rb channel username

require 'rubygems'
require 'redis'
require 'json'

$redis = Redis.new

data = {"user" => ARGV[1]}

loop do
  msg = STDIN.gets
  $redis.publish "track-web_development:events", data.merge('msg' => msg.strip).to_json
end