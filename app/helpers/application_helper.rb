module ApplicationHelper

  # From https://github.com/rwz/nestive/blob/master/lib/nestive/layout_helper.rb
  def extends(layout, &block)
    # Make sure it's a string
    layout = layout.to_s

    # If there's no directory component, presume a plain layout name
    layout = "layouts/#{layout}" unless layout.include?('/')

    # Capture the content to be placed inside the extended layout
    @view_flow.get(:layout).replace capture(&block)

    render file: layout
  end

  def current_menu_item_class?(test_path)
    return 'is-active' if request.path == test_path
    ''
  end

  def current_domain
    @current_domain ||= Domain.find(session[:domain_id]) if session[:domain_id]
  end

end
