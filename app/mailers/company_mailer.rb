class CompanyMailer < ApplicationMailer
  default from: 'contact@unknownanlytics.com'
  default template_path: "mailers/#{self.name.underscore}"

  def new_contact(email, request_text)
    @request_text = request_text
    mail(to: email, subject: 'Greeting from Unk')
  end
end
