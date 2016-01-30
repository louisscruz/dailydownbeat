class AddDirectionToVote < ActiveRecord::Migration[5.0]
  def change
    add_column :votes, :direction, :integer
  end
end
