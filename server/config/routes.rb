Rails.application.routes.draw do
  namespace :api do
    get    'login'  => 'sessions#new'
    post   'login'  => 'sessions#create'
    delete 'logout' => 'sessions#destroy'

    concern :commentable do
      resources :comments
    end

    resources :users
    resources :posts, concerns: :commentable
    resources :comments
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  # Serve websocket cable requests in-process
  # mount ActionCable.server => '/cable'
end
