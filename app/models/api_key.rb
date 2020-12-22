class ApiKey < ApplicationRecord
  belongs_to :domain
  belongs_to :user

  # validation

  validates_presence_of :user
  validates_presence_of :domain
  validates_presence_of :alias
  validates_presence_of :public_key
  validates_uniqueness_of :alias, scope: :domain_id

  # hooks

  before_validation :set_public_key
  after_create :sent_user_notification

  private

  def set_public_key
    self.public_key = 'ua_' + SecureRandom.urlsafe_base64
  end


  def sent_user_notification
    SendUserNewApiKeyCreationJob.perform_later(self.user_id)
  end

end
