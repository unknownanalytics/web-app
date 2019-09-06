class Domain < ApplicationRecord
  belongs_to :user

  has_one :domain_setting

  validates_uniqueness_of :name, scope: :user_id
  validates_presence_of :name
  before_create :build_domain_settings


  has_many :api_keys

  has_many :admins_domains
  has_many :admins, through: :admins_domains


  has_many :pages
  has_many :page_views, through: :pages


  has_many :page_view_locations, through: :pages

  private

  def build_domain_settings
    # build default profile instance. Will use default params.
    # The foreign key to the owning User model is set automatically
    build_domain_setting
    true # Always return true in callbacks as the normal 'continue' state
    # Assumes that the default_profile can **always** be created.
    # or
    # Check the validation of the profile. If it is not valid, then
    # return false from the callback. Best to use a before_validation
    # if doing this. View code should check the errors of the child.
    # Or add the child's errors to the User model's error array of the :base
    # error item
  end
end
