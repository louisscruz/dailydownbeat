FactoryGirl.define do
  factory :user do |u|
    id 1
    username "Johndoe"
    email "test@woohoo.com"
    password "testtest"
    password_confirmation "testtest"
    auth_token "testing123"
    confirmation_code SecureRandom.hex
    confirmed false
  end
end
