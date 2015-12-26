class AddAuthenticationTokenToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :auth_token, :string, default: ""
    remove_index :users, :email
    add_index :users, [:email, :auth_token], unique: true
  end
end
