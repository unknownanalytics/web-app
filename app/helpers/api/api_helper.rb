module Api::ApiHelper
  def get_range_of_weeks_n_months_ago(months_ago)
    intervals = []
    start = Date.today.beginning_of_week
    (start.months_ago(months_ago)..start).to_a.each_with_index do |e|
      unless intervals.include?(e.all_week)
        intervals.push(e.all_week)
      end
    end
    intervals
  end

end
