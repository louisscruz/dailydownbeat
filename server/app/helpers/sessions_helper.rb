module SessionsHelper
  def log_in(user)
    session[:user_id] = user.id
    p session
  end

  def current_user
    @current_user ||= User.find_by(auth_token: request.headers['Authorization'])
  end

  def log_out
    session.delete(:user_id)
  end

  def logged_in?
    !current_user.nil?
  end

  def authenticate_with_token!
    render json: { errors: "Not authenticated" }, status: :unauthorized unless logged_in?
  end
end
