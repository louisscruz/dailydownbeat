class Api::UsersController < ApplicationController
  before_action :authenticate_with_token!, only: [:update, :destroy]
  before_action :set_user, only: [:show, :update, :destroy, :confirm, :posts, :comments, :upvotes, :downvotes]
  wrap_parameters :user, include: [:username, :email, :password, :password_confirmation, :current_password, :bio]

  # GET /users
  def index
    @users = User.all

    render json: @users
  end

  def new
    @user = User.new
  end

  # GET /users/1
  def show
    render json: @user
  end

  # POST /users
  def create
    @user = User.new(user_params)
    @user.confirmation_code = SecureRandom.hex

    if @user.save
      UserMailer.confirm(@user).deliver_now
      UserMailer.welcome(@user).deliver_later!(wait: 5.minutes)
      log_in @user
      render json: @user, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  def update
    old_user = @user.dup
    if requires_password_validation
      if @user.update_with_password(user_params)
        UserMailer.changed_email(@user, old_user.email).deliver_now if user_params[:email].present?
        render json: @user
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    else
      if @user.update(user_params)
        render json: @user
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end
  end

  # DELETE /users/1
  def destroy
    @user.destroy
  end

  # POST /users/1/confirm/a23iuhfsdkfj23h98h...
  def confirm
    if (@user.confirmation_code == params[:confirmation_code])
      if (@user.confirmed)
        render json: @user.errors, status: :forbidden
      else
        @user.update_attribute(:confirmed, true)
        log_in @user
        render json: @user
      end
    else
      render json: @user.errors, status: :bad_request
    end
  end

  def posts
    @posts = @user.posts
    ordered_posts = @posts.sort_by { |a, b| a.ranking }.reverse!
    if (params[:page] && params[:per_page])
      @posts = Kaminari.paginate_array(ordered_posts).page(params[:page]).per(params[:per_page])
    end
    response.headers['X-Total-Count'] = ordered_posts.length.to_s

    render json: @posts, each_serializer: UserPostsSerializer
  end

  def comments
    @comments = @user.comments

    render json: @comments, each_serializer: UserCommentsSerializer
  end

  def upvotes
    @upvotes = @user.upvotes

    render json: @upvotes, each_serializer: VotesSerializer
  end

  def downvotes
    @downvotes = @user.downvotes

    render json: @downvotes, each_serializer: VotesSerializer
  end

  def validate_email
    response = attribute_validation_response(:email)

    render json: response
  end

  def validate_username
    response = attribute_validation_response(:username)

    render json: response
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def user_params
      params.require(:user).permit(:username, :email, :bio, :password, :password_confirmation, :confirmation_code, :confirmed, :current_password)
    end

    def attribute_validation_response(param)
      if User.exists?(param => params[param])
        { is_valid: false }
      else
        { is_valid: true }
      end
    end

    def requires_password_validation
      unsafe_params = [:current_password, :password, :password_confirmation, :email]
      unsafe_params.any? { |param| params[:user].key?(param) }
    end
end
