class AddOriginToPageViews < ActiveRecord::Migration[5.2]
  def change
    add_column :page_views, :origin, :string

  end
end
