class AddUtmParametersToPageView < ActiveRecord::Migration[5.2]
  def change
    add_column :page_views, :utm_source, :string
    add_column :page_views, :utm_medium, :string
    add_column :page_views, :utm_campaign, :string
    add_column :page_views, :utm_content, :string
    add_column :page_views, :utm_term, :string
  end
end
