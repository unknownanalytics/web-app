Rails.application.routes.draw do
  devise_for :users, path: 'accounts'
  # TODO remove this
  post 'billing/webhook' => 'billings/webhook'


  authenticate :user do
    namespace :dashboard do
      get '/' => 'stats#index'
      get '/notify' => 'overview#notify'

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
        %w(summary pages devices events geo heatmap export).each do |route|
          get "/#{route}" => "stats##{route}"
        end
      end

      # views, TODO, delete this

      resources :views

      # domains resources
      resources :domains do
        member do
          get 'settings'
          post 'settings'
        end
        member do
          scope :team, as: 'team' do
            get '/' => 'domains_teams#index'
            get '/new' => 'domains_teams#new'
            get '/sent-invitations' => 'domains_teams#invitations'
            get '/received-invitations' => 'domains_teams#invitations'
            post '/' => 'domains_teams#create'
            delete '/delete/:id' => 'domains_teams#delete'
          end
        end
        resources :api_keys
      end
    end

    namespace :api do
      get '/summary' => 'summary#index'
      get '/pages' => 'pages#index'
      get '/pages/details' => 'pages#details'
      get '/devices' => 'devices#index'
      get '/events' => 'events#index'
      get '/geo' => 'geo#index'
      get '/heatmap' => 'heatmap#index'
      get '/export' => 'export#index'
    end

    get '/subscription' => 'dashboard/subscription#index'
  end

  get "/:page" => "welcome#pages", :as => 'public_pages'

  authenticated :user do
    root 'dashboard/stats#index'
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'welcome#pages'

end
