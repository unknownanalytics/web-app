module Dashboard
  class PlanController < Dashboard::DashboardController

    layout 'account'
    @error = ""

    def subscribe

    end

    def confirm_subscribe
      if params[:plan].blank?
        @error = 'plans.required'
        return subscribe
      end

      plan_id = params[:plan]

      unless plan_id.nil?

      end
      local_stripe_customer = StripeCustomer.find({:account_id => current_user.id}).first
      unless local_stripe_customer
        stripe_customer = Stripe::Customer.create({
                                                      email: current_user.email,
                                                      source: params[:source],
                                                  })
        local_stripe_customer = StripeCustomer.new({:account_id => current_user.id, :stripe_customer_id => stripe_customer[:id]})
        local_stripe_customer.save!
      end


      ## !!!!! to check
      local_stripe_customer.plan = plan_id

      stripe_session = Stripe::Checkout::Session.create(
          payment_method_types: ['card'],
          customer: local_stripe_customer.stripe_customer_id,
          subscription_data: {
              items: [{
                          plan: plan_id,
                      }],
              trial_period_days: 30
          },
          success_url: "#{ENV['UNK_ANA_APP_HOST']}/billing/success",
          cancel_url: "#{ENV['UNK_ANA_APP_HOST']}/billing/cancel",
      )

      @checkout_session_id = stripe_session[:id]
    end
  end

  private

  def require_params
    params.require(:plan).permit(:data)
  end
end