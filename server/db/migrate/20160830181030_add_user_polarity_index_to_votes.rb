class AddUserPolarityIndexToVotes < ActiveRecord::Migration[5.1]
  def change
    add_index :votes, [:user_id, :polarity]
  end
end
