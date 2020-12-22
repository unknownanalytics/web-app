class AdminsDomain < ApplicationRecord
  belongs_to :domain
  belongs_to :admin,
             foreign_key: :admin_id,
             class_name: 'User'
  belongs_to :sender,
             foreign_key: :sender_id,
             class_name: 'User'

  # only one record
  validates_uniqueness_of :admin_id, scope: :domain_id
end
