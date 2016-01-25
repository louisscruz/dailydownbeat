FactoryGirl.define do
  factory :post do |p|
    p.sequence(:title) { |n| "Post #{n}"}
    p.url "http://www.google.com"
  end
end
