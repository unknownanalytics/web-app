class User < ApplicationRecord
  after_create :send_new_user_mail
  # Include default devise modules. Others available are:
  #  and , :timeoutable :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable, :lockable


  # my own domains
  has_many :own_domains,
           foreign_key: :user_id,
           class_name: "Domain"

  ## admins invitations
  has_many :sent_invitations,
           :foreign_key => 'sender_id',
           :class_name => "AdminsDomain"
  ## admins invitations
  has_many :received_invitations,
           :foreign_key => 'admin_id',
           :class_name => "AdminsDomain"

  ## admins of domain
  has_many :admins_domains,
           :foreign_key => :admin_id

  has_many :domains,
           :through => :admins_domains,
           :foreign_key => :admin_id

  def new_account_message
    UserMailer.new_account_message(self).deliver_now
  end

  def own_domain(domain)
    domain.user_id == self.id
  end
end
