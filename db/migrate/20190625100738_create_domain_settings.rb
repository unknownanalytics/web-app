class CreateDomainSettings < ActiveRecord::Migration[5.2]
  def change
    create_table :domain_settings do |t|
      t.boolean :track_geo, default: false
      t.string :origins
      t.references :domain, foreign_key: true, index: {unique: true}
      t.timestamps
    end
  end
end
