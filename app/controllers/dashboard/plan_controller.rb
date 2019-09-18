module Dashboard
  class PlanController < Dashboard::DashboardController

    layout 'account'
    before_action :set_api_key

    def subscribe

    end

    def confirm_subscribe
      plan_id = params[:plan]

      stripe_customer = StripeCustomer.find_or_create_by(account_id: current_user.id)

      if stripe_customer.new_record? or stripe_customer.stripe_customer_id.nil?
        customer = Stripe::Customer.create({
                                               email: current_user.email,
                                               source: params[:source],
                                           })

        stripe_customer.stripe_customer_id = customer[:id]
        stripe_customer.save!
      end

      ## !!!!! to check
      stripe_customer.plan = plan_id

      stripe_session = Stripe::Checkout::Session.create(
          payment_method_types: ['card'],
          customer: stripe_customer.stripe_customer_id,
          subscription_data: {
              items: [{
                          plan: plan_id,
                      }],
              trial_period_days: 30
          },
          success_url: "https://85fa80ae.ngrok.io/billing/webhook",
          cancel_url: "https://85fa80ae.ngrok.io/billing/webhook",
      )

      @checkout_session_id = stripe_session[:id]
    end

    private

    def set_api_key
      Stripe.api_key = 'sk_test_KhHgc2X0Vyvw9L9Mj2R2aDDu00o2MA5d1U'
    end

  end
end