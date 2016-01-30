# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
User.create(username: 'louisscruz', email: 'test@me.com', password: 'testtest', password_confirmation: 'testtest')

100.times do
  title = Faker::Hacker.say_something_smart
  url = Faker::Internet.url
  created_at = Faker::Time.backward(1750, :all)
  updated_at = Faker::Time.between(created_at, DateTime.now)
  user_id = rand(1..100)
  Post.create(title: title, url: url, created_at: created_at, updated_at: updated_at, user_id: user_id)

  comment_body = Faker::Hacker.say_something_smart
  comment_id = 1
  Comment.create(body: comment_body,  user_id: user_id, commentable: Post.first)

  username = Faker::Internet.user_name
  email = Faker::Internet.safe_email
  password = 'testtest'
  User.create(username: username, email: email, password: password, password_confirmation: password)
end
