class Api::UsersController < ApplicationController
  before_action :authenticate_with_token!, only: [:update, :destroy]
  before_action :set_user, only: [:show, :update, :destroy, :confirm, :posts, :comments, :upvotes, :downvotes]
  wrap_parameters :user, include: [:username, :email, :password, :password_confirmation]

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
      UserMailer.welcome(@user).deliver_now
      UserMailer.confirm(@user).deliver_now
      render json: @user, status: :created, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
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
    response = { is_valid: true }
    if User.exists?(:email => params[:email])
      response[:is_valid] = false
    end

    render json: response
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def user_params
      params.require(:user).permit(:username, :email, :password, :password_confirmation, :confirmation_code, :confirmed)
    end
end
