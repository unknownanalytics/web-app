class StripeCustomer < ApplicationRecord
  belongs_to :account, foreign_key: :account_id, class_name: 'User'

  validates_uniqueness_of :account_id
  validates_uniqueness_of :stripe_customer_id

end
