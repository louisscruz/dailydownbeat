class Api::PostsController < ApplicationController
  before_action :authenticate_with_token!, only: [:create, :upvote, :downvote, :unvote]
  before_action :authenticate_as_self_or_admin!, only: [:update, :destroy]
  before_action :set_post, only: [:show, :update, :destroy, :upvote, :downvote]
  before_action :set_vote, only: [:unvote]
  #serialization_scope :this_user

  # GET /posts
  def index
    if params[:kind] == nil
      @unordered_posts = Post.all
    else
      @unordered_posts = Post.where(kind: params[:kind])
    end
    ordered_posts = @unordered_posts.sort_by { |a, b| a.ranking }.reverse!
    @posts = Kaminari.paginate_array(ordered_posts).page(params[:page]).per(params[:per_page])
    response.headers['X-Total-Count'] = ordered_posts.length.to_s

    render json: @posts
  end

  # GET /posts/1
  def show
    render json: @post
  end

  # POST /posts
  def create
    @post = Post.new(post_params)

    if @post.save
      render json: @post, status: :created
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /posts/1
  def update
    if @post.update(post_params)
      render json: @post
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # DELETE /posts/1
  def destroy
    @post.destroy
  end

  def vote(polarity)
    vote = Vote.new(votable: @post, user_id: this_user.id, polarity: polarity)

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
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def post_params
      params.require(:post).permit(:title, :url, :user_id)
    end

    def set_vote
      @vote = Vote.find_by(votable_id: params[:id], user_id: this_user.id)
    end

    def add_voting_history
      @post.each do |post|
        post.upvoted = false
        post.downvoted = false
      end
    end
end
