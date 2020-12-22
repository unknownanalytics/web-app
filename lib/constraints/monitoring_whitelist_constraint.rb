require "#{Rails.root}/app/models/whitelist_ip_monitoring_address.rb"
module Constraints
  class MonitoringWhiteListConstraint
    def initialize
      #@ips = WhitelistIpMonitoringAddress.all
    end

    def matches?(request)
      WhitelistIpMonitoringAddress.exists?(:ip => request.remote_ip)
    end
  end
end