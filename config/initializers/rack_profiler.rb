# frozen_string_literal: true

if Rails.env.development?
  require "rack-mini-profiler"

  # initialization is skipped so trigger it
  Rack::MiniProfilerRails.initialize!(Rails.application)
  # TODO, remove this , it was just for test
  Rack::MiniProfiler.config.disable_caching = false # defaults to true

end
