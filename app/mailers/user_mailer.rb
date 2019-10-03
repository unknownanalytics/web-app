class UserMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.user_mailer.new_api_key_creation.subject
  #
  def new_api_key_creation(user)
    @greeting = "Some one has create a new apik for domain "

    mail to: user.email
  end

  #
  def invitation_as_admin(user, domain)
    @message = "You have been invited to be and admin for #{domain.name}"
    mail to: user.email
  end

  def new_account_message(user)
    @greeting = user.email
    mail(to: user.email, subject: 'Welcome to Unk')
  end
end
