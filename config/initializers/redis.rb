redis_db = ENV['UNK_ANA_REDIS_DB'] || 0

$redis = Redis.new(url: "#{ENV['UNK_ANA_REDIS_URI']}/#{redis_db}")