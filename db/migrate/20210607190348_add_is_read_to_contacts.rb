class AddIsReadToContacts < ActiveRecord::Migration[6.1]
  def change
    add_column :contacts, :is_read, :boolean, default: false
  end
end
