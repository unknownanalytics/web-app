class CreateSubscriptionPlans < ActiveRecord::Migration[5.2]
  def change
    create_table :subscription_plans do |t|
      t.string :stripe_plan_id, null: false
      t.string :name, null: false
      t.string :description, null: false
      t.boolean :is_active, default: false
      t.float :monthly_price

      t.timestamps
    end
  end
end
