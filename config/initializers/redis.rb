redis_db = ENV['REDIS_DB'] || 0
$redis = Redis.new(url: "redis://#{ENV['UNK_ANA_REDIS_URI']}/#{redis_db}")