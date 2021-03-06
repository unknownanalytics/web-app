class Api::ExportController < Api::ApiController
  def index
    reply_json ({ r: 'h', interval: "he" })
  end

  def as_pdf
    @geo_img = params[:geo_img]
    @views_img = params[:views_img]
    @devices_img = params[:devices_img]
    @stats = JSON.parse(params[:stats])
    @views = JSON.parse(params[:views])
    puts "@views"
    # puts @views
    html = render_to_string partial: 'reports/report.daily'
    #footer = render_to_string partial: 'reports/shared/footer'
    # puts html
    pdf = WickedPdf.new.pdf_from_string(html, {
      :footer => { :right => 'Page [page] of [topage]', :left => 'Generated by  Unk analytics' },
    })

    send_data(pdf,
              :filename => "report.pdf",
              :disposition => 'attachment')
  end

end
