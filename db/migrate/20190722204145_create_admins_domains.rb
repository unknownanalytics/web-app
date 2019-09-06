class CreateAdminsDomains < ActiveRecord::Migration[5.2]
  def change
    create_table :admins_domains do |t|
      t.references :admin, index: true, foreign_key: {to_table: :users}
      t.references :sender, index: true, foreign_key: {to_table: :users}
      t.references :domain, index: true, foreign_key: true
      t.boolean :validated
      t.datetime :validated_at
      t.datetime :leaved_at

      t.timestamps
    end
  end
end
