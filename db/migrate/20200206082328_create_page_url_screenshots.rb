class CreatePageUrlScreenshots < ActiveRecord::Migration[5.2]
  def change
    create_table :page_url_screenshots do |t|
      t.references :page
      t.string :screenshot_location
      t.string :screenshot_path
      t.string :thumbnail_location
      t.string :thumbnail_path
      t.string :heat_location
      t.string :heat_path
      t.string :resolution
      t.string :storage_type, default: "LOCAL"

      t.timestamps
    end
  end
end
