Rails.application.routes.draw do


  ### Internal routes for apps communications
  namespace :hooks do
    post '/screenshot' => 'heatmaps#screenshot'
  end

  devise_for :users, path: 'accounts'

  if ENV["UNK_APP_IS_BILLABLE"]
    # TODO remove this
    post '/billing/webhook' => 'billings/webhook'
  end

  authenticate :user do
    namespace :dashboard do
      get '/' => 'stats#index'
      get '/notify' => 'notifications#notify'
      get '/domains/received-invitations' => 'domains_teams#received_invitations'
      post '/domains/accept-invitation/:domain_id' => 'domains_teams#accept_invitation', as: 'accept_admin_invitation'
      delete '/domains/decline-invitation/:domain_id' => 'domains_teams#decline_invitation', as: 'decline_admin_invitation'


      # acccounts and subscribe
      get 'account/plan/current' => 'plan#current_plan'
      get 'account/plan/current/upgrade' => 'plan#upgrade'
      get 'account/plan/current/confirm-upgrade' => 'plan#upgrade'
      get 'account/plan/subscribe' => 'plan#subscribe'
      post 'account/plan/confirm-subscribe' => 'plan#confirm_subscribe'

      # change current domain
      post '/set-current-domain' => 'dashboard#set_current_domain'

      # stats for current domain
      scope :stats, as: 'stats' do
        get '/' => 'stats#overview'
        %w(summary pages devices events errors geo heatmaps export).each do |route|
          get "/#{route}" => "stats##{route}"
        end
      end

      # domains resources
      resources :domains do
        member do
          get 'settings'
          post 'settings'
        end
        member do
          scope :team, as: 'team' do
            get '/' => 'domains_teams#index'
            delete '/delete/:admin_domain_id' => 'domains_teams#delete_member', as: 'delete_member'
            get '/new' => 'domains_teams#new'
            post '/' => 'domains_teams#invite', as: 'invite'
            get '/sent-invitations' => 'domains_teams#sent_invitations'
          end
        end
        resources :api_keys
      end
    end

    namespace :api do
      get '/summary' => 'summary#index'
      # page
      get '/pages' => 'pages#index'
      get '/pages/summary' => 'pages#summary'
      get '/pages/details' => 'pages#views_details'
      get '/devices' => 'devices#index'
      get '/events' => 'events#index'
      get '/errors' => 'errors#index'
      get '/geo' => 'geo#index'
      get '/heatmaps' => 'heatmaps#index'
      get '/export' => 'export#index'
    end

    get '/subscription' => 'dashboard/subscription#index'
  end


  authenticated :user do
    root 'dashboard/stats#index'
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'welcome#pages', as: 'home_path'



  post '/contact' => 'contact#contact_us'
  get '/contact/' => 'contact#index'


  ## track main path
  get 'track' => 'api#track'


  get "/:page" => "welcome#pages", :as => 'public_pages'

end
