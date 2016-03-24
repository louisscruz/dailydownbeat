class FixPostKindColumnName < ActiveRecord::Migration[5.0]
  def change
    rename_column :posts, :type, :kind
  end
end
