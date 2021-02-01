puts ">>>>>>>>>>>>>>>>>"
puts "Connecting to redis"
puts ENV['UNK_ANA_REDIS_URI']
$redis = Redis.new(url: "#{ENV['UNK_ANA_REDIS_URI']}")