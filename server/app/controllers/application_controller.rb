class ApplicationController < ActionController::API
  include ActionController::RequestForgeryProtection
  include SessionsHelper
  protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }
end
