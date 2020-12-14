# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_02_28_073225) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "admins_domains", force: :cascade do |t|
    t.bigint "admin_id"
    t.bigint "sender_id"
    t.bigint "domain_id"
    t.boolean "validated", default: false
    t.datetime "validated_at"
    t.datetime "leaved_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["admin_id"], name: "index_admins_domains_on_admin_id"
    t.index ["domain_id"], name: "index_admins_domains_on_domain_id"
    t.index ["sender_id"], name: "index_admins_domains_on_sender_id"
  end

  create_table "api_keys", force: :cascade do |t|
    t.string "public_key"
    t.datetime "expires"
    t.bigint "domain_id"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "alias"
    t.string "private_key"
    t.boolean "is_test", default: false
    t.index ["domain_id"], name: "index_api_keys_on_domain_id"
    t.index ["public_key"], name: "index_api_keys_on_public_key"
    t.index ["user_id"], name: "index_api_keys_on_user_id"
  end

  create_table "contacts", force: :cascade do |t|
    t.string "email"
    t.string "subject"
    t.string "body"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "domain_settings", force: :cascade do |t|
    t.boolean "track_geo", default: false
    t.string "origins"
    t.bigint "domain_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["domain_id"], name: "index_domain_settings_on_domain_id", unique: true
  end

  create_table "domains", force: :cascade do |t|
    t.string "name"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_domains_on_name", unique: true
    t.index ["user_id"], name: "index_domains_on_user_id"
  end

  create_table "page_errors", force: :cascade do |t|
    t.bigint "page_id", null: false
    t.jsonb "metadata"
    t.string "user_agent"
    t.string "os"
    t.string "browser"
    t.boolean "is_mobile", default: false
    t.boolean "is_tablet", default: false
    t.boolean "is_desktop", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_test", default: false
    t.index ["page_id"], name: "index_page_errors_on_page_id"
  end

  create_table "page_events", force: :cascade do |t|
    t.bigint "page_id", null: false
    t.jsonb "metadata"
    t.string "user_agent"
    t.string "os"
    t.string "browser"
    t.boolean "is_mobile", default: false
    t.boolean "is_tablet", default: false
    t.boolean "is_desktop", default: false
    t.integer "sequence_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_test", default: false
    t.index ["page_id"], name: "index_page_events_on_page_id"
  end

  create_table "page_url_screenshots", force: :cascade do |t|
    t.bigint "page_id"
    t.string "screenshot_location"
    t.string "screenshot_path"
    t.string "thumbnail_location"
    t.string "thumbnail_path"
    t.string "heat_location"
    t.string "heat_path"
    t.string "resolution"
    t.string "storage_type", default: "LOCAL"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["page_id"], name: "index_page_url_screenshots_on_page_id"
  end

  create_table "page_view_locations", force: :cascade do |t|
    t.string "country_iso_2", limit: 2
    t.string "country_iso_3", limit: 3
    t.string "city_name"
    t.string "uuid"
    t.float "lat"
    t.float "long"
    t.bigint "page_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_test", default: false
    t.index ["city_name"], name: "index_page_view_locations_on_city_name"
    t.index ["country_iso_2"], name: "index_page_view_locations_on_country_iso_2"
    t.index ["page_id"], name: "index_page_view_locations_on_page_id"
    t.index ["uuid"], name: "index_page_view_locations_on_uuid"
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
    t.string "referer"
    t.string "query"
    t.bigint "page_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "utm_source"
    t.string "utm_medium"
    t.string "utm_campaign"
    t.string "utm_content"
    t.string "utm_term"
    t.string "origin"
    t.boolean "is_test", default: false
    t.index ["page_id"], name: "index_page_views_on_page_id"
  end

  create_table "pages", force: :cascade do |t|
    t.string "url", null: false
    t.string "full_url", null: false
    t.string "path"
    t.string "host"
    t.string "fragment"
    t.jsonb "metadata"
    t.string "query"
    t.integer "page_views_count", default: 0
    t.bigint "domain_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_test", default: false
    t.index ["domain_id"], name: "index_pages_on_domain_id"
    t.index ["url"], name: "index_pages_on_url"
  end

  create_table "stripe_customers", force: :cascade do |t|
    t.string "stripe_customer_id", null: false
    t.bigint "account_id", null: false
    t.string "plan", null: false
    t.jsonb "meta"
    t.datetime "plan_ends_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_stripe_customers_on_account_id", unique: true
    t.index ["stripe_customer_id"], name: "index_stripe_customers_on_stripe_customer_id", unique: true
  end

  create_table "stripe_subscription_histories", force: :cascade do |t|
    t.string "subscription_stripe_id", null: false
    t.bigint "subscription_plan_id_id", null: false
    t.bigint "stripe_customer_id"
    t.datetime "started_at", null: false
    t.datetime "ends_at", null: false
    t.string "plan_id"
    t.jsonb "meta"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["stripe_customer_id"], name: "index_stripe_subscription_histories_on_stripe_customer_id"
    t.index ["subscription_plan_id_id"], name: "index_stripe_subscription_histories_on_subscription_plan_id_id"
  end

  create_table "subscription_plans", force: :cascade do |t|
    t.string "stripe_plan_id", null: false
    t.string "name", null: false
    t.string "description", null: false
    t.boolean "is_active", default: false
    t.float "monthly_price"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
  add_foreign_key "page_errors", "pages"
  add_foreign_key "page_events", "pages"
  add_foreign_key "page_view_locations", "pages"
  add_foreign_key "page_views", "pages"
  add_foreign_key "pages", "domains"
  add_foreign_key "stripe_customers", "users", column: "account_id"
  add_foreign_key "stripe_subscription_histories", "stripe_customers"
end
