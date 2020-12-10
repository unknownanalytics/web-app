class Contact < ApplicationRecord
  validates_presence_of :email
  validates_presence_of :subject
  #validates_presence_of :body
  validates :email, format: {with: URI::MailTo::EMAIL_REGEXP}
end
