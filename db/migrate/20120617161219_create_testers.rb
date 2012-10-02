class CreateTesters < ActiveRecord::Migration
  def change
    create_table :testers do |t|
      t.string :email
      t.string :udid
      t.string :name

      t.timestamps
    end
  end
end
