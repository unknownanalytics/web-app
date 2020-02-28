class AddSandboxData < ActiveRecord::Migration[5.2]
  def change
    add_column :pages, :is_test, :boolean, default: false

    add_column :page_views, :is_test, :boolean, default: false

    add_column :page_view_locations, :is_test, :boolean, default: false

    add_column :page_errors, :is_test, :boolean, default: false

    add_column :page_events, :is_test, :boolean, default: false

    add_column :api_keys, :is_test, :boolean, default: false
  end
end
