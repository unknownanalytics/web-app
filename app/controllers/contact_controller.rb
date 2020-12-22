class ContactController < ApplicationController
  def index
    @subject = params[:subject]
  end

  def contact_us
    contact = Contact.new(contact_form)
    if contact.save!
      flash[:success] = "You message has been saved, we will be in touch soon !"
      CompanyMailer.new_contact(contact.email, contact.subject).deliver_now
    else
      flash[:contact_error] = contact.errors
    end
    redirect_to root_path

  end

  private


  def contact_form
    params.fetch(:contact, {}).permit([:email, :subject])
  end
end
