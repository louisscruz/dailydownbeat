class AddVotesCountToComment < ActiveRecord::Migration[5.0]
  def change
    add_column :comments, :votes_count, :integer, :default => 0
  end
end
