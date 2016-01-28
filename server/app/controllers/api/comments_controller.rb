class Api::CommentsController < ApplicationController
  #before_action :authenticate_with_token!, only: [:update, :destroy]
  before_action :set_comment, only: [:show, :update, :destroy]
  #wrap_parameters :user, include: [:username, :email, :password, :password_confirmation]

  # GET ../comments
  def index
    @commentable = find_commentable
    if @commentable === nil
      @comments = Comment.all
    else
      @comments = @commentable.comments
    end

    render json: @comments
  end

  def new
    @comment = Comment.new
  end

  # GET ../comments/1
  def show
    render json: @comment
  end

  # POST ../comments
  def create
    @comment = Comment.new(comment_params)
  end

  private

    def set_comment
      @comment = Comment.find(params[:id])
    end

    def comment_params
      params.require(:comment).permit(:body, :commentable_id, :commentable_type, :user_id)
    end

    def find_commentable
      params.each do |name, value|
        if name =~ /(.+)_id$/
          return $1.classify.constantize.find(value)
        end
      end
      nil
    end
=begin
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

    if @user.save
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

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def user_params
      params.require(:user).permit(:username, :email, :password, :password_confirmation)
    end
=end
end
