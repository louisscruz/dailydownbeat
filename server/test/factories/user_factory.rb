FactoryGirl.define do
  factory :user do |u|
    sequence(:id) {|n| n}
    username "Johndoe"
    email "test@woohoo.com"
    password "testtest"
    password_confirmation "testtest"
    confirmation_code SecureRandom.hex
    confirmed true
  end
end
