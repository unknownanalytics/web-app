class PageView < ApplicationRecord
  belongs_to :page, counter_cache: true
end
