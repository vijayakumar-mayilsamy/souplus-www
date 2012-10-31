SouplusWww::Application.routes.draw do
  root :to => 'Pages#home'
  
  
  
  match '/games' => 'pages#games'
  match '/rankings' => 'pages#rankings'
  match '/viewgame' => 'pages#viewgame'
  match '/how_it_works' => 'pages#how_it_works'
  match '/forgot_password' => 'pages#forgot_password'
  match '/reset_password/:token' => 'pages#resetPassword'
  match '/wrong_signup' => 'pages#wrong_signup'
  match '/newhome' => 'pages#newhome'
  match '/index' => 'pages#index'
  
  match '/career' => "pages#career"
  match '/about' => 'pages#about'
  match '/contact' => 'pages#contact'
  match '/api/testers/email_exists' => 'Testers#emailExistsAPI'
  match '/api/testers/create' => 'Testers#createAPI'
  
  match '/testing/step1' => 'Pages#testingStep1'
  match '/testing/step2' => 'Pages#testingStep2'
  match '/testing/step3' => 'Pages#testingStep3'
  
  match '/testing/signup' => 'Pages#testingSignup'
  
  match '/signup/to-be-verified' => 'pages#presignup', :as => 'presignup'
  match '/admin' => "Testers#index"
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
