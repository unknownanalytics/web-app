module Dashboard
  class DomainsTeamsController < Dashboard::DashboardController
    before_action :verify_current_domain_selected
    before_action :verify_current_user_own_domain, except: [:index, :new, :create]


    # GET /domains
    # GET /domains.json
    def index
      @admins = current_domain.admins
      @domains = current_user.domains
    end

    # GET /domains
    # GET /domains.json
    def invitations
      @invitations = current_user.sent_invitations#.where(:validated => false)
    end

    # GET /settings
    def invite

    end
  end
end