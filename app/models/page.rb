class Page < ApplicationRecord
  has_many :page_views
  has_many :page_views_locations
  belongs_to :domain
end
