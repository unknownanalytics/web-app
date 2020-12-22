class CreateStripeCustomers < ActiveRecord::Migration[5.2]
  def change
    create_table :stripe_customers do |t|
      t.string :stripe_customer_id, index: {unique: true}, null: false
      t.references :account, foreign_key: {to_table: :users}, index: {unique: true}, null: false
      t.string :plan, null: false
      t.jsonb :meta
      t.datetime :plan_ends_at, null: false
      t.timestamps
    end
  end
end