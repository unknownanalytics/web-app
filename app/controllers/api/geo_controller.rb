class Api::GeoController < Api::ApiController

  def index
    period_range = get_date_range
    table_name = 'page_view_locations'
    column_name = 'country_iso_2'
    # select country_iso_2, count(country_iso_2) from page_view_locations group by country_iso_2 ;
    r = PageViewLocation
            .select("Count(#{table_name}.#{column_name}) as c,  #{table_name}.#{column_name} as iso")
            .group(:iso)
            .joins(:page => :domain)
            .where("#{table_name}" => {:created_at => period_range})
            .where(:pages => {:domain => current_domain})

    reply_json ({info: r, interval: period_range})
  end

  def index_with_pages
    period_range = get_date_range
    table_name = 'page_view_locations'
    column_name = 'country_iso_2'
    r = PageViewLocation
            .select("Count(#{table_name}.#{column_name}),  #{table_name}.#{column_name}, pages.full_url")
            .group("#{table_name}.#{column_name}", :country_iso_2)
            .group('pages.full_url', :full_url)
            .joins(:page => :domain)
            .where("#{table_name}" => {:created_at => period_range})
            .where(:pages => {:domain => current_domain})

    reply_json ({r: r, interval: period_range})
  end

  def test
    period_range = get_date_range
    # current_domain.id
    @pages = Page.select(:id, :full_url).where(:domain_id => 4).all
    #@domain = Domain.find(4)
    if stale?(etag: @pages, :last_modified => @pages.maximum(:created_at))
      reply_json ({r: @pages, interval: period_range})
    end
  end

end
