class Api::ErrorsController < Api::ApiController
  def index
    page_id = params[:page_id]
    pages = Page

    if page_id
      pages = pages.where(:id => page_id)
    end

    pages = pages.joins(:domain)
                .includes(:page_errors)
                .where(:domains => { :id => current_domain.id })
                .joins(:page_errors)

    pages = pages.distinct
    info =  {pages: pages}

    if page_id
      # period_range = get_date_range
      errors  = PageError.where(page_id: page_id)
      info['errors'] = errors.as_json(except:  [:id,:page_id, :created_at, :updated_at] )
      #reply_json(info)
    end
    reply_json(info)
  end


end
