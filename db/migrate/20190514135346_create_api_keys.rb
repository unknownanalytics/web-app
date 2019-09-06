class CreateApiKeys < ActiveRecord::Migration[5.2]
  def change
    create_table :api_keys do |t|
      t.string :value
      t.datetime :expires
      t.references :domain, foreign_key: true
      t.references :user, foreign_key: true

      t.timestamps
    end
    add_index :api_keys, :value
  end
end
