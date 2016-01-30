class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :email, :password, :password_confirmation, :auth_token
  #has_many :posts do
    #post_ids = []
    #object.posts.each do |p|
      #post_ids << p.id
    #end
    #post_ids
  #end
end
