class User < ApplicationRecord
  # Include default devise modules. Others available are:
  #  and , :timeoutable :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable, :lockable
end
