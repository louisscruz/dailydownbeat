require 'json_web_token'

module SessionsHelper
  def create_session(user)
    session[:user_id] = user.id
  end

  #current_user is taken by active_model_serializers
  def this_user
    auth_token = request.headers["Authorization"]
    if auth_token
      auth_token = auth_token.split(" ").last
      begin
        decoded_token = JsonWebToken.decode auth_token
      rescue JWT::ExpiredSignature
        return
      end
      @this_user ||= User.find_by(auth_token: auth_token)
    end
  end

  def log_out(user)
    logged_in? ? user.generate_authentication_token! : user.destroy_token!
    auth_token = user.auth_token
    user.update_attribute(:auth_token, auth_token)
  end

  def logged_in?
    this_user.present?
  end

  def authenticate_with_token!
    render json: { errors: "Not authenticated" }, status: :unauthorized unless logged_in?
  end

  def log_in(user)
    create_session(user)
    user.generate_authentication_token!
    user.update_attribute(:auth_token, user.auth_token)
  end

  def authenticate_as_self_or_admin!
    # FIX THIS!
    render json: { errors: "Not authorized" }, status: :unauthorized unless is_self? || is_admin?
  end

  def is_self?
    p user
    # FIX THIS!!!
    #p super.id
    #user = User.find(Post.findparams[:id]) if params["post"]
    #decoded_token = JsonWebToken.decode(request.headers["Authorization"])
    #user = User.find(decoded_token.id)
    #auth_token = request.headers["Authorization"]
    #auth_token = auth_token.split(" ").last if auth_token
    #user.auth_token != auth_token
  end

  def is_admin?
    if logged_in? && this_user.authenticate(params[:password])
      this_user.admin
    end
  end
end
