class Api::PostsController < ApplicationController
  #before_action :authenticate_with_token!, only: [:index, :show]
  before_action :set_post, only: [:show, :update, :destroy]
  after_action only: [:index] { set_pagination_headers(:posts) }

  # GET /posts
  def index
    @posts = Post.page(params[:page]).per(params[:per_page])

    render json: @posts
  end

  # GET /posts/1
  def show
    p @post.comments
    render json: @post
  end

  # POST /posts
  def create
    @post = Post.new(post_params)

    if @post.save
      render json: @post, status: :created, location: @post
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

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def post_params
      params.require(:post).permit(:title, :comments)
    end
end
