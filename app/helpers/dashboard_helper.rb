module DashboardHelper
  def admin_received_invitations_count
    current_user.received_invitations.where(:validated => [false, nil]).count
  end
end
