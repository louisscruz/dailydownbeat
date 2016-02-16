class AddPointsToComments < ActiveRecord::Migration[5.0]
  def change
    add_column :comments, :points, :integer, :default => 0
  end
end
