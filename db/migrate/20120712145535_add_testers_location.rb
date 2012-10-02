class AddTestersLocation < ActiveRecord::Migration
  def up
    add_column :testers, :location, :string
  end

  def down
  end
end
