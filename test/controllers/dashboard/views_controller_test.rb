require 'test_helper'

class Dashboard::ViewsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @dashboard_view = dashboard_views(:one)
  end

  test "should get index" do
    get dashboard_views_url
    assert_response :success
  end

  test "should get new" do
    get new_dashboard_view_url
    assert_response :success
  end

  test "should create dashboard_view" do
    assert_difference('Dashboard::View.count') do
      post dashboard_views_url, params: { dashboard_view: {  } }
    end

    assert_redirected_to dashboard_view_url(Dashboard::View.last)
  end

  test "should show dashboard_view" do
    get dashboard_view_url(@dashboard_view)
    assert_response :success
  end

  test "should get edit" do
    get edit_dashboard_view_url(@dashboard_view)
    assert_response :success
  end

  test "should update dashboard_view" do
    patch dashboard_view_url(@dashboard_view), params: { dashboard_view: {  } }
    assert_redirected_to dashboard_view_url(@dashboard_view)
  end

  test "should destroy dashboard_view" do
    assert_difference('Dashboard::View.count', -1) do
      delete dashboard_view_url(@dashboard_view)
    end

    assert_redirected_to dashboard_views_url
  end
end
