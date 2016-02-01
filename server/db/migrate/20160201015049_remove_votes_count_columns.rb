class RemoveVotesCountColumns < ActiveRecord::Migration[5.0]
  def change
    remove_column :posts, :votes_count
    remove_column :comments, :votes_count
  end
end
