redis_uri = "#{ENV['UNK_ANA_REDIS_URI']}"

Sidekiq.configure_server do |config|
  config.redis = {url: redis_uri}
end

Sidekiq.configure_client do |config|
  config.redis = {url: redis_uri}
end