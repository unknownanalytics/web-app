class ReportWorker
  include Sidekiq::Worker

  def perform
    ReportMailer.report("fathallah.houssem@gmail.com").deliver_now
  end
end