Rails.application.routes.draw do
  devise_for :users, path: 'accounts'

  authenticate :user do
    namespace :dashboard do
      get '/' => 'overview#index'
      get '/notify' => 'overview#notify'

      get 'account/plan'

      # change current domain
      post '/set-current-domain' => 'dashboard#set_current_domain'

      # stats for current domain
      scope :stats, as: 'stats' do
        get '/summary' => 'stats#summary'
        get '/pages' => 'stats#pages'
        get '/devices' => 'stats#devices'
        get '/events' => 'stats#overview'
        get '/geo' => 'stats#overview'
        get '/heatmap' => 'stats#overview'
        get '/export' => 'stats#overview'
        get '/' => 'stats#overview'
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

    get '/subscription' => 'dashboard/subscription#index'
  end

  get "/:page" => "welcome#pages", :as => 'public_pages'

  authenticated :user do
    root 'dashboard/overview#index'
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'welcome#pages'

end
