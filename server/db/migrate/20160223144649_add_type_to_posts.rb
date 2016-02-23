class AddTypeToPosts < ActiveRecord::Migration[5.0]
  def change
    add_column :posts, :type, :string
    add_index :posts, :type
  end
end
