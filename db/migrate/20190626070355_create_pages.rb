class CreatePages < ActiveRecord::Migration[5.2]
  def change
    create_table :pages do |t|
      t.string :url, null: false, unique: true
      t.string :full_url, unique: true
      t.string :path
      t.string :host
      t.string :fragment
      t.jsonb :metadata
      t.string :query
      t.integer :page_views_count, default: 0
      t.references :domain, foreign_key: true, null: false, index: true

      t.timestamps
    end
    add_index :pages, :url
  end
end
