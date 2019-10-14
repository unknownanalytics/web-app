class WelcomeController < ApplicationController
  def pages
    @page = params[:page] || 'home'
    if valid_page?
      render "welcome/page"
    else
      render file: "public/404.html", status: :not_found
    end
  end

  private

  def valid_page?
    @page = @page.gsub(/-/, '_')
    File.exist?(Pathname.new(Rails.root + "app/views/welcome/_#{@page}.html.erb"))
  end
end
