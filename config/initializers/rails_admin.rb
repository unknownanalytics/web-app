RailsAdmin.config do |config|
  config.authenticate_with do
    warden.authenticate! scope: :user
  end
  config.current_user_method(&:current_user)
  config.authorize_with do
    redirect_to main_app.root_path unless current_user.is_admin?
  end
end