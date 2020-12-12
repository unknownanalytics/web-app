class ReportMailer < ApplicationMailer
  default template_path: "mailers/#{self.name.underscore}"


  def report(mail)
    @message = "test"
    # system('convert -background none -density 1000 -resize 1000x compass.svg compass.png')
    # template = render_to_string partial: 'reports/svgs/sample.line'
    # template.result
    # attachments['file-name.jpg'] = File.read('compass.png')
    # attachments.inline['image.jpg'] = File.read('compass.png')
    mail to: mail

  end

end
