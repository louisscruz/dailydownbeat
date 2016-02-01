# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
User.create(username: 'louisscruz', email: 'test@me.com', password: 'testtest', password_confirmation: 'testtest')

100.times do
  user_username = Faker::Internet.user_name
  user_email = Faker::Internet.safe_email
  user_password = 'testtest'
  User.create(username: user_username, email: user_email, password: user_password, password_confirmation: user_password)

  post_title = Faker::Hacker.say_something_smart
  post_url = Faker::Internet.url
  post_created_at = Faker::Time.backward(1750, :all)
  post_updated_at = Faker::Time.between(post_created_at, DateTime.now)
  post_user_id = rand(1..100)
  Post.create(title: post_title, url: post_url, created_at: post_created_at, updated_at: post_updated_at, user_id: post_user_id)

  rand_post = Post.offset(rand(Post.count)).first
  rand_comment = Comment.offset(rand(Comment.count)).first
  rand_vote_user = User.offset(rand(User.count)).first
  rand_comment_user = User.offset(rand(User.count)).first
  polarity = 1

  comment_body = Faker::Hacker.say_something_smart
  Comment.create(body: comment_body, user_id: rand_comment_user.id, commentable: rand_post)

  Vote.create(votable: rand_post, user_id: rand_vote_user.id, polarity: polarity)
  Vote.create(votable: rand_comment, user_id: rand_vote_user.id, polarity: polarity)
end

50.times do
  rand_post = Post.offset(rand(Post.count)).first
  rand_comment = Comment.offset(rand(Comment.count)).first
  rand_vote_user = User.offset(rand(User.count)).first
  rand_comment_user = User.offset(rand(User.count)).first
  polarity = -1

  Vote.create(votable: rand_post, user_id: rand_vote_user.id, polarity: polarity)
  Vote.create(votable: rand_comment, user_id: rand_vote_user.id, polarity: polarity)
end
