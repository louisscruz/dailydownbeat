FactoryGirl.define do
  factory :post do |p|
    p.sequence(:title) { |n| "Post #{n}"}
    p.url "http://www.google.com"
    p.user_id 1
    p.created_at Faker::Time.backward(1950, :all)
  end
end
