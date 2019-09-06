class User < ApplicationRecord
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



  ## admins of domains
  has_many :admins_domains

  has_many :domains,
           :through => :admins_domains,
           :foreign_key => "admin_id",
           :class_name => "User"


end
