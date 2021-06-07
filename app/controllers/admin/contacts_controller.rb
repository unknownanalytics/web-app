class Admin::ContactsController < Admin::AdminController

  def index
    page = params[:page] || 0
    @page = page
    #@contacts = Contact.where({ is_read: :false }).page(page).per(50)
    @contacts = Contact.order([:is_read]).page(page).per(50)
  end

  def show
    id = params[:id]
    @contact = Contact.find_by_id(id)
    @contact.is_read = true
    @contact.save!
  end
end
