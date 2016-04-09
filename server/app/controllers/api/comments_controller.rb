class Api::CommentsController < ApplicationController
  before_action :authenticate_with_token!, only: [:create, :update, :destroy]
  before_action :set_comment, only: [:show, :update, :destroy]
  #wrap_parameters :user, include: [:username, :email, :password, :password_confirmation]

  # GET ../comments
  def index
    @commentable = find_commentable
    if @commentable === nil
      @comments = Comment.includes(:user)
    else
      @comments = @commentable.comments
    end

    render json: @comments, include: ["comments.**"]
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

    if @comment.save
      render json: @comment, status: :created
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @comment.destroy
      render status: :ok, json: @comment
    end
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
end
