class Api::ApiController < ApplicationController
  include ApplicationHelper


  def reply_json(r, status = 200)
    render :json => {
        data: r
    }, status: status
  end

  protected

  def get_date_range
    # @count_in_month = PageView.where(:created_at => 1.month.ago.in_time_zone(Time.zone)..Time.zone.now).joins(:page => :domain).where(:domains => {:id => current_user.own_domains}).count
    # default period month
    interval = params[:interval]
    back = params[:back].present? && params[:back].to_i || 1
    stop = Time.now + 1.second
    if params[:start].present?
      stop = params[:start].to_date
    end

    if interval == 'hour'
      start = stop - back.hours
    elsif interval == 'day'
      start = stop - back.days
    elsif interval === 'week'
      start = stop - back.week
    elsif interval === 'month'
      start = stop - back.week
    else
      # monthly
      start = stop.years_ago(2)
    end


    start..stop
  end

end
