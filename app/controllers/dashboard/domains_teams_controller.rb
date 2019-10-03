module Dashboard
  class DomainsTeamsController < Dashboard::DashboardController
    before_action :verify_current_domain_selected, except: [:received_invitations, :accept_invitation]
    before_action :verify_current_user_own_current_domain, only: [:index, :invite, :delete_member]


    # GET /domains
    # GET /domains.json
    def index
      @user_admins = current_domain.admins.where({:admins_domains => {:validated => true}})
      @waiting_count = current_domain.admins.where({:admins_domains => {:validated => [false, nil]}}).count
    end


    def received_invitations
      @invitations = current_user.received_invitations.includes(:domain, :sender).where(:validated => [false, nil]).all
    end


    def accept_invitation
      admin_domain = current_user.received_invitations.find_by_domain_id(params[:domain_id])
      if admin_domain
        admin_domain.validated = true
        admin_domain.save
        redirect_to dashboard_path
      else
        flash[:notice] = t("domain.team.errors.unknown")
      end

    end

    def decline_invitation
      admin_domain = current_user.received_invitations.find_by_domain_id(params[:domain_id])
      if admin_domain
        admin_domain.delete
        redirect_to dashboard_path
      else
        flash[:notice] = t("domain.team.errors.unknown")
      end
    end

    # GET /domains
    # GET /domains.json
    def sent_invitations
      @invitations = current_user.sent_invitations.where({:validated => [false, nil], :domain_id => current_domain.id})
    end


    # GET /settings
    def invite
      email = invite_params
      if User.exists?(:email => email)
        user = User.find_by_email(email)
        ## as owner
        if user.id == current_user.id
          flash[:error] = t('domain.team.errors.already_owner')
        else
          create_new_admin(user)
          redirect_to dashboard_team_domain_path
          return
        end
      else
        flash[:error] = t("domain.team.errors.invitaion_user_not_found")
      end
      redirect_to new_dashboard_team_domain_path
    end

    # DELETE member
    def delete_member
      member = current_domain.admins_domains.find_by_admin_id(params[:admin_domain_id])
      if member
        member.delete
      else
        flash[:notice] = t("domain.team.errors.unknown")
      end
      redirect_to dashboard_team_domain_path
    end

    private

    # Never trust parameters from the scary internet, only allow the white list through.
    def invite_params
      params.fetch(:email)
    end

    def create_new_admin(user_admin)
      record = AdminsDomain.create(admin_id: user_admin.id, domain_id: current_domain.id, sender_id: current_user.id)
      # TODO, errors
      unless record.save
        flash[:notice] = t("domain.team.errors.admin_already_exists")
        return
      end
      UserMailer.invitation_as_admin(user_admin, current_domain).deliver_now
      flash[:notice] = "#{t('domain.team.invitation.sent')} #{user_admin.email}"
    end
  end
end