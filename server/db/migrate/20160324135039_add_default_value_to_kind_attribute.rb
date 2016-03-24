class AddDefaultValueToKindAttribute < ActiveRecord::Migration[5.0]
  def up
    change_column :posts, :kind, :string, :default => "post"
  end

  def down
    change_column :posts, :kind, :string, :default => nil
  end
end
