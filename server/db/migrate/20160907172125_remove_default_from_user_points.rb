class RemoveDefaultFromUserPoints < ActiveRecord::Migration[5.1]
  def change
    change_column_default :users, :points, nil
  end
end
