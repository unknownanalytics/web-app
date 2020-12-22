class CreatePageErrors < ActiveRecord::Migration[5.2]
  def change
    create_table :page_errors do |t|
      t.references :page, foreign_key: true, null: false, index: true
      t.jsonb :metadata
      t.string :user_agent
      t.string :os
      t.string :browser
      t.boolean :is_mobile, default: false
      t.boolean :is_tablet, default: false
      t.boolean :is_desktop, default: false
      t.timestamps
    end
  end
end
