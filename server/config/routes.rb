Rails.application.routes.draw do
  namespace :api do
    get    'login'             => 'sessions#new'
    post   'login'             => 'sessions#create'
    delete 'logout'            => 'sessions#destroy'
    get    'address/validate'  => 'users#validate_email'
    get    'username/validate' => 'users#validate_username'

    concern :commentable do
      resources :comments
    end

    resources :users do
      member do
        post 'confirm/:confirmation_code' => 'users#confirm'
        get  'posts' => 'users#posts'
        get  'comments' => 'users#comments'
        patch 'update_password' => 'users#update'
        get 'upvotes' => 'users#upvotes'
        get 'downvotes' => 'users#downvotes'
      end
    end
    resources :posts, concerns: :commentable
    resources :comments do
      resources :comments
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  # Serve websocket cable requests in-process
  # mount ActionCable.server => '/cable'
end
