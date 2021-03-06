Rails.application.routes.draw do

  ### Internal routes for apps communications
  namespace :hooks do
    post '/screenshot' => 'heatmaps#screenshot'
  end
  # collector resources !!!!!
  post 'collect' => 'api/sdk/v1/collect#index'

  namespace :api do
    namespace :ext do
      namespace :v1 do
        get 'views' => 'views#index'
      end
    end
  end

  devise_for :users, path: 'accounts'

  if ENV["UNK_APP_IS_BILLABLE"]
    # TODO remove this
    post '/billing/webhook' => 'billings/webhook'
  end

  authenticate :user do
    # dashboard
    namespace :dashboard do
      get '/' => 'stats#index'
      get '/notify' => 'notifications#notify'
      get '/domains/received-invitations' => 'domains_teams#received_invitations'
      post '/domains/accept-invitation/:domain_id' => 'domains_teams#accept_invitation', as: 'accept_admin_invitation'
      delete '/domains/decline-invitation/:domain_id' => 'domains_teams#decline_invitation', as: 'decline_admin_invitation'

      # accounts and subscribe
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
    # api
    namespace :api do
      get '/overview' => 'overview#index'
      get '/overview/top_pages' => 'overview#top_pages'
      get '/pages/summary' => 'pages#summary'
      get '/pages/views' => 'pages#views'
      get '/pages/weekly_by_days' => 'pages#weekly_by_days'
      get 'pages/:page_id/views' => 'pages#page_views_details'
      get '/geo' => 'geo#index'
      get '/devices' => 'devices#index'

      get '/errors' => 'errors#index'

      # TODO
      get '/events' => 'events#index'
      # clicks and events
      get '/heatmaps' => 'heatmaps#index'
      get '/export' => 'export#index'
      post '/export/pdf' => 'export#as_pdf'
    end

    # admin
    namespace :admin do
      get '/' => 'admin#index'
      resources :users, only: [:index, :show]
      resources :contacts, only: [:index, :show]
    end

    get '/subscription' => 'dashboard/subscription#index'
  end

  authenticated :user do
    scope :welcome do
      root 'welcome#pages', as: 'home_auth_path'
    end
    root 'dashboard/stats#index'
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'welcome#pages', as: 'home_path'

  post '/contact' => 'contact#contact_us'
  get '/contact/' => 'contact#index'

  mount Sidekiq::Web => '/sidekiq'

  get "/:page" => "welcome#pages", :as => 'public_pages'

end
