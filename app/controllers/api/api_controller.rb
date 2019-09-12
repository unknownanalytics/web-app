class Api::ApiController < ApplicationController
  include ApplicationHelper

  protected

  def get_date_range
    # @count_in_month = PageView.where(:created_at => 1.month.ago.in_time_zone(Time.zone)..Time.zone.now).joins(:page => :domain).where(:domains => {:id => current_user.own_domains}).count
    # default period month
    interval = params[:interval] || 'month'
    back = params[:back].present? && params[:back].to_i || 1
    stop = Time.now + 1.day
    if params[:start].present?
      stop = params[:start].to_s
    end

    if interval == 'day'
      start = stop - back.days
    elsif interval === 'week'
      start = stop - back.week
    else
      # monthly
      start = stop - back.month
    end
    start..stop
  end

  def reply_json(r)
    render :json => {
        data: r
    }
  end
end
