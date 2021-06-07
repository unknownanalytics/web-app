class Admin::AdminController < ApplicationController
  include ApplicationHelper
  layout 'admin'
  # OR use a helper
  before_action :check_admin

  def index
    @users_count = User.count
    @contacts_count = Contact.count
    @contacts_count_new = Contact.where({is_read: :false}).count
  end

  protected

  def check_admin
    unless current_user.email == ENV['UNK_SYSTEM_ADMIN']
      render file: "public/404.html", layout: 'application', status: :not_found
    end
  end

end
