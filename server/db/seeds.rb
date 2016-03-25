# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Seed users
User.create(username: 'louisscruz', email: 'louisstephancruz@me.com', password: 'testtest', password_confirmation: 'testtest', confirmation_code: SecureRandom.hex)

300.times do |x|
  user_username = Faker::Internet.user_name(Faker::Book.author + x.to_s)
  user_email = Faker::Internet.safe_email('user' + x.to_s)
  user_password = 'testtest'
  user_bio = Faker::Hacker.say_something_smart
  user_confirmation_code = SecureRandom.hex
  User.create(username: user_username, email: user_email, password: user_password, password_confirmation: user_password, confirmation_code: user_confirmation_code, bio: user_bio)

  3.times do |y|
    post_title = ""
    post_hash = {"post" => "", "ask" => "Ask DD: ", "show" => "Show DD: ", "job" => "Job: "}
    post_type = post_hash.to_a.sample.flatten
    post_title_prepend = post_type[1]

    until post_title.length < 81 && post_title.length > 2
      post_title = post_title_prepend + Faker::StarWars.quote
    end
    post_type = post_type[0]
    post_url = Faker::Internet.url
    if y < 2
      post_created_at = Faker::Time.backward(2010, :all)
    else
      post_created_at = Faker::Time.between(12.hours.ago, Time.now, :all)
    end
    post_updated_at = Faker::Time.between(post_created_at, DateTime.now)
    post_user_id = rand(1..x)
    Post.create(title: post_title, url: post_url, created_at: post_created_at, updated_at: post_updated_at, user_id: post_user_id, kind: post_type)
  end
  unless x < 20
    5.times do |z|
      comment_body = Faker::StarWars.quote
      rand_post = Post.offset(rand(Post.count)).first
      rand_comment_user_id = rand(1..x)
      Comment.create(body: comment_body, user_id: rand_comment_user_id, commentable: rand_post)
      rand_comment = rand(1..Comment.count)
      Comment.create(body: comment_body, user_id: rand_comment_user_id, commentable: Comment.find(rand_comment))

      rand_comment = Comment.offset(rand(Comment.count)).first
      rand_vote_user_id = ([*1..x] - [rand_post.user_id, rand_comment.user_id]).sample
      votes = [-1, -1, 1, 1, 1, 1, 1]
      polarity = votes[rand(0..3)]
      Vote.create(votable: rand_post, user_id: rand_vote_user_id, polarity: polarity)
      Vote.create(votable: rand_comment, user_id: rand_vote_user_id, polarity: polarity)
    end
  end
end

p "#{User.count} users created"
