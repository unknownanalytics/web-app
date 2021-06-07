class Admin::UsersController < Admin::AdminController

  def index
    page = params[:page] || 0
    @page = page
    @users = User.page(page).per(50)
  end

end
