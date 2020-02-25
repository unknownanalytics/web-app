class Contact < ApplicationRecord
  validates_presence_of :email
  validates_presence_of :subject
  validates :email, format: {with: URI::MailTo::EMAIL_REGEXP}
end
