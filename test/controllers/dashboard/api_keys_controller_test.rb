require 'test_helper'

class Dashboard::ApiKeysControllerTest < ActionDispatch::IntegrationTest
  setup do
    @dashboard_api_key = dashboard_api_keys(:one)
  end

  test "should get index" do
    get dashboard_api_keys_url
    assert_response :success
  end

  test "should get new" do
    get new_dashboard_api_key_url
    assert_response :success
  end

  test "should create dashboard_api_key" do
    assert_difference('Dashboard::ApiKey.count') do
      post dashboard_api_keys_url, params: { dashboard_api_key: {  } }
    end

    assert_redirected_to dashboard_api_key_url(Dashboard::ApiKey.last)
  end

  test "should show dashboard_api_key" do
    get dashboard_api_key_url(@dashboard_api_key)
    assert_response :success
  end

  test "should get edit" do
    get edit_dashboard_api_key_url(@dashboard_api_key)
    assert_response :success
  end

  test "should update dashboard_api_key" do
    patch dashboard_api_key_url(@dashboard_api_key), params: { dashboard_api_key: {  } }
    assert_redirected_to dashboard_api_key_url(@dashboard_api_key)
  end

  test "should destroy dashboard_api_key" do
    assert_difference('Dashboard::ApiKey.count', -1) do
      delete dashboard_api_key_url(@dashboard_api_key)
    end

    assert_redirected_to dashboard_api_keys_url
  end
end
