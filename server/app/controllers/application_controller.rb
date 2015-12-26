class ApplicationController < ActionController::API
  include ActionController::RequestForgeryProtection
  include SessionsHelper
  protect_from_forgery with: :exception
end
