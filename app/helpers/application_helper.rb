module ApplicationHelper
  # Domain specific errors
  class DomainSessionError < StandardError; end

  # From https://github.com/rwz/nestive/blob/master/lib/nestive/layout_helper.rb
  def extends(layout, &block)
    # Make sure it's a string
    layout = layout.to_s

    # If there's no directory component, presume a plain layout name
    layout = "layouts/#{layout}" unless layout.include?('/')

    # Capture the content to be placed inside the extended layout
    @view_flow.get(:layout).replace capture(&block)

    render template: layout
  end

  def default_page_title
    ENV['UNK_ANA_DEFAULT_PAGE_TITLE'] || 'Unknown Analytics'
  end

  def current_menu_item_class?(test_path)
    return 'is-active' if request.path == test_path
    ''
  end

  def current_domain
    @current_domain ||= Domain.find(session[:domain_id]) if session[:domain_id]
  rescue ActiveRecord::RecordNotFound
    flash[:notice] = "Wrong post it"
    session[:domain_id] = nil
    raise DomainSessionError
  end

  def current_plan
    @current_plan ||= StripeSubscriptionHistory.find_by_stripe_customer_id(StripeCustomer.find_by_account_id(current_user.id))
  end

end
