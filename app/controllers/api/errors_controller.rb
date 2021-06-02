class Api::ErrorsController < Api::ApiController
  def index

    pages = Page

    pages = pages.joins(:domain)
                 .includes(:page_errors)
                 .where(:domains => { :id => current_domain.id })
                 .joins(:page_errors)

    pages = pages.distinct
    info = { pages: pages }
    ## page id
    page_id = params[:page_id]
    if page_id
      period_range = get_date_range
      # pagination for db
      xPage = params[:xPage]
      unless xPage
        xPage = 0
      end
      per_page = 20
      # period_range = get_date_range
      errors = PageError.where(page_id: page_id).where(created_at: period_range).page(xPage).per(per_page)
      info['errors'] = errors.as_json(only: [:metadata, :browser, :id])
      info['perPage'] = per_page
      #reply_json(info)
    end
    reply_json(info)
  end

end
