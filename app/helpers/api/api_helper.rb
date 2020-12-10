module Api::ApiHelper
  def get_range_of_weeks_n_months_ago(months_ago)
    intervals = []
    (Date.today.months_ago(months_ago)..Date.today).to_a.each_with_index do |e, index|
      unless intervals.include?(e.all_week)
        intervals.push(e.all_week)
      end

    end
    intervals
  end

end
