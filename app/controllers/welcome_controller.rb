class WelcomeController < ApplicationController
  def pages
    @page = params[:page] || 'home'
    if valid_page?
      render "welcome/page"
    else
      render file: "public/404.html", status: :not_found
    end
  end

  def contact_us
    contact = Contact.new(contact_us_form)
    if contact.save
      flash[:success] = "You message has been saved, we will be in touch soon !"
      BusinessMailer.new_contact(contact.email, contact.subject).deliver_now
    else
      flash[:contact_error] = contact.errors
    end
    redirect_to root_path

  end


  private

  def valid_page?
    @page = @page.gsub(/-/, '_')
    File.exist?(Pathname.new(Rails.root + "app/views/welcome/_#{@page}.html.erb"))
  end


  def contact_us_form
    params.fetch(:contact, {}).permit([:email, :subject])
  end

end
