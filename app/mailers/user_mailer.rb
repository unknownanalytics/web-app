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
end
