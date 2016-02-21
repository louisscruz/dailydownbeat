class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :email, :password, :auth_token, :bio
end
