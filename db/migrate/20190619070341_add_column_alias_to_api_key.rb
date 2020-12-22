class AddColumnAliasToApiKey < ActiveRecord::Migration[5.2]
  def change
    add_column :api_keys, :alias, :string
    add_column :api_keys, :private_key, :string
    rename_column :api_keys, :value, :public_key
  end
end
