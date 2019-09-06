class CreatePageViews < ActiveRecord::Migration[5.2]
  def change
    create_table :page_views do |t|
      t.jsonb :metadata
      t.string :os
      t.string :browser
      t.boolean :is_mobile, default: false
      t.boolean :is_tablet, default: false
      t.boolean :is_desktop, default: false
      t.integer :width_resolution
      t.integer :height_resolution
      t.string :query
      t.references :page, foreign_key: true, null: false, index: true

      t.timestamps
    end

  end
end
