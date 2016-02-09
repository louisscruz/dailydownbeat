FactoryGirl.define do
  factory :user do
    id 1
    username "Johndoe"
    email "test@woohoo.com"
    password "testtest"
    password_confirmation "testtest"
    auth_token "testing123"
    confirmation_code SecureRandom.hex
  end
end
