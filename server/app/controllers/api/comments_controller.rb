class Api::CommentsController < ApplicationController
  before_action :authenticate_with_token!, only: [:create, :update, :destroy]
  before_action :authenticate_as_self_or_admin!, only: [:update, :destroy]
  before_action :set_comment, only: [:show, :update, :destroy, :upvote, :downvote, :unvote]
  before_action :set_vote, only: [:unvote]
  wrap_parameters :comment, include: [:body, :commentable_id, :commentable_type, :user_id]
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

  # PUT/PATCH ../comments/1
  def update
    if @comment.update(comment_params)
      render json: @comment
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @comment.destroy
  end

  def vote(polarity)
    vote = Vote.new(votable: @comment, user_id: this_user.id, polarity: polarity)

    if vote.save
      render json: vote
    else
      render json: vote.errors, status: :unprocessable_entity
    end
  end

  def upvote
    vote(1)
  end

  def downvote
    vote(-1)
  end

  def unvote
    @vote.destroy
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

    def set_vote
      @vote = Vote.find_by(votable_id: params[:id], user_id: this_user.id)
    end
end
