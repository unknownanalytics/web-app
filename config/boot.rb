=begin
puts "CONFIG PG >>>>>>"
puts ENV['UNK_ANA_DATABASE_URI']
puts "CONFIG REDIS >>>>>>"
puts ENV['UNK_ANA_REDIS_URI']
puts "CONFIG SMTP >>>>>>"
puts ENV['UNK_ANA_SMTP_URI']
=end
ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __dir__)

require 'bundler/setup' # Set up gems listed in the Gemfile.
require 'bootsnap/setup' # Speed up boot time by caching expensive operations.
