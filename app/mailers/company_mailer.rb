class CompanyMailer < ApplicationMailer
  default from: 'contact@unknownanlytics.com'
  default template_path: "mailers/#{self.name.underscore}"

  def new_contact(email, request_text)
    @request_text = request_text
    mail(to: email, subject: 'Hello from Unk')
  end

  def new_contact_notify_admin(email, request_text)
    @request_text = request_text
    @email = email
    @admin = ENV['UNK_CONTACT_ADMIN'] || "fathallah.houssem@gmail.com"
    mail(to: @admin, subject: '[UNK]New Contact ')
  end

end
