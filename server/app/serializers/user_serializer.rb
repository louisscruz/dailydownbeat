class UserSerializer < ActiveModel::Serializer
  attributes :id, :auth_token, :username, :email, :bio, :confirmed, :admin
end
