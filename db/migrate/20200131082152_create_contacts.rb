class CreateContacts < ActiveRecord::Migration[5.2]
  def change
    create_table :contacts do |t|
      t.string :email
      t.string :subject
      t.string :body

      t.timestamps
    end
  end
end
