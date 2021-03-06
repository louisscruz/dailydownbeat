class AddConfirmationToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :confirmation_code, :string
    add_column :users, :confirmed, :boolean, :default => false
  end
end
