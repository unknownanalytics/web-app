class ApplicationController < ActionController::Base
  before_action :set_locale

  def set_locale
    I18n.locale = params[:locale] || session[:locale] || I18n.default_locale
    session[:locale] = I18n.locale
  end

  def reply_json(r, status = 200)
    render :json => {
        data: r
    }, status: status
  end
end
