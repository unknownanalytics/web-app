class CreateStripeSubscriptions < ActiveRecord::Migration[5.2]
  def change
    create_table :stripe_subscriptions do |t|
      t.string :subscription_id
      # local references, follow the reference to find real strip customer and our account
      t.references :stripe_customer, foreign_key: true
      # keep a link the latest stripe subscription to keep history
      t.references :stripe_subscription, foreign_key: true
      t.jsonb :meta
      t.timestamps
    end
  end
end
