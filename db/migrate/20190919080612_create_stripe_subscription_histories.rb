class CreateStripeSubscriptionHistories < ActiveRecord::Migration[5.2]
  def change
    create_table :stripe_subscription_histories do |t|
      t.string :subscription_stripe_id, null: false
      t.references :subscription_plan_id, null: false
      # local references, follow the reference to find real strip customer and our account
      t.references :stripe_customer, foreign_key: true
      # a copy of the current info
      t.datetime :started_at, null: false
      # a copy of the current info
      t.datetime :ends_at, null: false
      t.string :plan_id
      t.jsonb :meta
      t.timestamps
    end
  end
end