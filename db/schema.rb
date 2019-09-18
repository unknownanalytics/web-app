# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_09_18_073732) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "admins_domains", force: :cascade do |t|
    t.bigint "admin_id"
    t.bigint "sender_id"
    t.bigint "domain_id"
    t.boolean "validated"
    t.datetime "validated_at"
    t.datetime "leaved_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["admin_id"], name: "index_admins_domains_on_admin_id"
    t.index ["domain_id"], name: "index_admins_domains_on_domain_id"
    t.index ["sender_id"], name: "index_admins_domains_on_sender_id"
  end

  create_table "api_keys", id: :bigint, default: -> { "nextval('apikeys_id_seq'::regclass)" }, force: :cascade do |t|
    t.string "public_key"
    t.datetime "expires"
    t.bigint "domain_id"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "alias"
    t.string "private_key"
    t.index ["domain_id"], name: "index_apikeys_on_domain_id"
    t.index ["public_key"], name: "index_apikeys_on_value"
    t.index ["user_id"], name: "index_apikeys_on_user_id"
  end

  create_table "domain_settings", force: :cascade do |t|
    t.boolean "track_geo", default: false
    t.string "origins"
    t.bigint "domain_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["domain_id"], name: "index_domain_settings_on_domain_id"
  end

  create_table "domains", force: :cascade do |t|
    t.string "name"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_domains_on_name"
    t.index ["user_id"], name: "index_domains_on_user_id"
  end

  create_table "page_view_locations", force: :cascade do |t|
    t.string "country_iso_2"
    t.string "country_iso_3"
    t.string "city_name"
    t.string "uuid"
    t.float "lat"
    t.float "long"
    t.bigint "page_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["page_id"], name: "index_page_view_locations_on_page_id"
  end

  create_table "page_views", force: :cascade do |t|
    t.jsonb "metadata"
    t.string "os"
    t.string "browser"
    t.boolean "is_mobile", default: false
    t.boolean "is_tablet", default: false
    t.boolean "is_desktop", default: false
    t.integer "width_resolution"
    t.integer "height_resolution"
    t.string "query"
    t.bigint "page_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "utm_source"
    t.string "utm_medium"
    t.string "utm_campaign"
    t.string "utm_content"
    t.string "utm_term"
    t.index ["page_id"], name: "index_page_views_on_page_id"
  end

  create_table "pages", force: :cascade do |t|
    t.string "url", null: false
    t.string "full_url", null: false
    t.string "path"
    t.string "host"
    t.string "fragment"
    t.string "parameters"
    t.integer "page_views_count", default: 0
    t.bigint "domain_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["domain_id"], name: "index_pages_on_domain_id"
    t.index ["url"], name: "index_pages_on_url"
  end

  create_table "stripe_customers", force: :cascade do |t|
    t.string "stripe_customer_id"
    t.bigint "account_id"
    t.string "plan"
    t.jsonb "meta"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_stripe_customers_on_account_id", unique: true
    t.index ["stripe_customer_id"], name: "index_stripe_customers_on_stripe_customer_id", unique: true
  end

  create_table "stripe_subscriptions", force: :cascade do |t|
    t.string "subscription_id"
    t.bigint "stripe_customer_id"
    t.bigint "stripe_subscription_id"
    t.jsonb "meta"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["stripe_customer_id"], name: "index_stripe_subscriptions_on_stripe_customer_id"
    t.index ["stripe_subscription_id"], name: "index_stripe_subscriptions_on_stripe_subscription_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_admin", default: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
  end

  add_foreign_key "admins_domains", "domains"
  add_foreign_key "admins_domains", "users", column: "admin_id"
  add_foreign_key "admins_domains", "users", column: "sender_id"
  add_foreign_key "api_keys", "domains"
  add_foreign_key "api_keys", "users"
  add_foreign_key "domain_settings", "domains"
  add_foreign_key "domains", "users"
  add_foreign_key "page_view_locations", "pages"
  add_foreign_key "page_views", "pages"
  add_foreign_key "pages", "domains"
  add_foreign_key "stripe_customers", "users", column: "account_id"
  add_foreign_key "stripe_subscriptions", "stripe_customers"
  add_foreign_key "stripe_subscriptions", "stripe_subscriptions"
end
