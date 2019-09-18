module Dashboard
  class StatsController < Dashboard::DashboardController

    before_action :check_format

    def overview

    end

    def pages

    end

    def devices

    end

    def summary

    end

    def page

    end

    def geo

    end

    def heatmap

    end

    private

    def check_format
      return if request.format == :json
      respond_to do |format|
        format.html {render :index}
      end
    end
  end
end