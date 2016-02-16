class AddCommentCountToComments < ActiveRecord::Migration[5.0]
  def change
    add_column :comments, :comment_count, :integer, :default => 0
  end
end
