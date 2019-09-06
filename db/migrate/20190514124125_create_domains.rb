class CreateDomains < ActiveRecord::Migration[5.2]
  def change
    create_table :domains do |t|
      t.string :name
      t.references :user, foreign_key: true

      t.timestamps
    end
    add_index :domains, :name, unique: true
  end
end
