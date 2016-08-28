# Seed users
User.create(username: 'louisscruz', email: 'louisstephancruz@me.com', password: 'testtest', password_confirmation: 'testtest', confirmation_code: SecureRandom.hex)
=begin
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
    @post_user_id = rand(1..x)
    Post.create(title: post_title, url: post_url, created_at: post_created_at, updated_at: post_updated_at, user_id: @post_user_id, kind: post_type)
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
      rand_vote_user_id = ([*1..x] - [rand_post.user_id, rand_comment.user_id, @post_user_id]).sample
      votes = [-1, -1, 1, 1, 1, 1, 1]
      polarity = votes[rand(0..3)]
      Vote.create(votable: rand_post, user_id: rand_vote_user_id, polarity: polarity)
      Vote.create(votable: rand_comment, user_id: rand_vote_user_id, polarity: polarity)
    end
  end
end
=end
# Seed Users
300.times do |x|
  user_username = Faker::Internet.user_name(Faker::Book.author + x.to_s)
  user_email = 'user' + x.to_s + '@gmail.com'
  user_password = 'testtest'
  user_bio = Faker::Hacker.say_something_smart
  User.create(username: user_username, email: user_email, password: user_password, password_confirmation: user_password, bio: user_bio, confirmed: true)
end

# Seed Posts
users = User.all.order(id: :asc)
user_count = users.count
p "#{user_count} users created"

users.each do |user|
  3.times do |x|
    post_title = ""
    post_hash = {"post" => "", "ask" => "Ask DD: ", "show" => "Show DD: ", "job" => "Job: "}
    post_type = post_hash.to_a.sample.flatten
    post_title_prepend = post_type[1]

    until post_title.length < 81 && post_title.length > 2
      post_title = post_title_prepend + Faker::StarWars.quote
    end
    post_type = post_type[0]
    post_url = Faker::Internet.url
    if x < 2
      post_created_at = Faker::Time.backward(2010, :all)
    else
      post_created_at = Faker::Time.between(12.hours.ago, Time.now, :all)
    end
    post_updated_at = Faker::Time.between(post_created_at, DateTime.now)
    Post.create(title: post_title, url: post_url, created_at: post_created_at, updated_at: post_updated_at, user_id: user.id, kind: post_type)
  end
end

post_count = Post.count

p "#{post_count} posts created"

slice_size = 20

users.each do |user|
  slice = [user_count - user.id, slice_size].max
  comment_body = Faker::StarWars.quote
  3.times do |x|
    post = Post.order(points: :desc).offset(rand(user.id * x)).first
    Comment.create(body: comment_body, user_id: user.id, commentable: post)
  end
  2.times do |x|
    comment = Comment.offset(rand(user.id * x)).first
    Comment.create(body: comment_body, user_id: user.id, commentable: comment)
  end
end

p "#{Comment.count} comments created"

users.each do |user|
  5.times do |x|
    post_slice = [post_count - user.id, slice_size].max
    post = Post.where.not(user_id: user.id).order(points: :desc).offset(rand(user.id * (x / 2))).first
    comment = Comment.where.not(user_id: user.id).order(points: :desc).offset(rand(user.id * (x / 2))).first
    polarity = [-1, 1, 1][x % 3]
    Vote.create(votable: post, user_id: user.id, polarity: polarity)
    Vote.create(votable: comment, user_id: user.id, polarity: polarity)
  end
end

p "#{Vote.count} votes created"
