redis_db = ENV['REDIS_DB'] || 0
$redis = Redis.new(url: "redis://#{ENV['REDIS_URL']}/#{redis_db}")