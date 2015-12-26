FactoryGirl.define do
  factory :user do
    username "Johndoe"
    email "test@woohoo.com"
    password "testtest"
    password_confirmation "testtest"
    auth_token "testing123"
  end
end
