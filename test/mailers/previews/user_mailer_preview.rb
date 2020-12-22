# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/new_api_key_creation
  def new_api_key_creation
    UserMailer.new_api_key_creation
  end

end
