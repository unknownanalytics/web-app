class Dashboard::DashboardController < ApplicationController
  include ApplicationHelper
  layout 'dashboard'
  # OR use a helper
  before_action :load_domains

  "" "
  Set user session domain
  " ""

  def load_domains
    @my_domains = current_user.own_domains.where.not(:name => blank?).all
    confirmed_domains = current_user.domains.joins(:admins_domains).where(:admins_domains => {:validated => true})
    @my_domains = @my_domains + confirmed_domains
  end

  ## select a domain from my list
  def set_current_domain
    domain = Domain.where(user: current_user, id: params[:domain_id]).first
    if domain.nil?
      domain = AdminsDomain.where(admin: current_user, domain_id: params[:domain_id]).first&.domain
    end
    if domain.nil?
      redirect_to dashboard_path, :notice => "Please select a domain"
    else
      session[:domain_id] = domain.id
      redirect_to dashboard_path, :notice => "Changed to domain name #{domain.name}"
    end
  end


  def verify_current_domain_selected
    if current_domain.nil?
      redirect_to dashboard_path, notice: "You should select a domain"
    end
  end

  # Only owner
  def verify_current_user_own_current_domain
    ## Add domain
    unless current_user && current_domain && current_user.own_domain(current_domain)
      respond_to do |format|
        format.html {render :file => "#{Rails.root}/public/404", :layout => false, :status => :not_found}
        format.xml {head :not_found}
        format.any {head :not_found}
      end
    end
  end

  # Only owner
  def verify_current_user_is_domain_for_domain
    ## Add domain
    unless current_user && current_domain && current_user.own_domain(current_domain)
      respond_to do |format|
        format.html {render :file => "#{Rails.root}/public/404", :layout => false, :status => :not_found}
        format.xml {head :not_found}
        format.any {head :not_found}
      end
    end
  end

  private


end
