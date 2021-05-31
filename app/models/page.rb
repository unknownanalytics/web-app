class Page < ApplicationRecord
  has_many :page_views
  has_many :page_view_locations
  has_many :page_errors
  belongs_to :domain
end
