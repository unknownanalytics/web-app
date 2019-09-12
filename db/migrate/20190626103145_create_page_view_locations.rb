class CreatePageViewLocations < ActiveRecord::Migration[5.2]
  def change
    create_table :page_view_locations do |t|
      t.string :country_iso_2, :limit => 2
      t.string :country_iso_3, :limit => 3
      t.string :city_name
      t.string :uuid
      t.float :lat
      t.float :long
      t.references :page, foreign_key: true, null: false, index: true

      t.timestamps
    end
    add_index :page_view_locations, :uuid
    add_index :page_view_locations, :city_name
    add_index :page_view_locations, :country_iso_2
  end
end
