require 'test_helper'

class Dashboard::DomainsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @domain = domains(:one)
  end

  test "should get index" do
    get dashboard_domains_url
    assert_response :success
  end

  test "should get new" do
    get new_dashboard_domain_url
    assert_response :success
  end

  test "should create domain" do
    assert_difference('Domain.count') do
      post dashboard_domains_url, params: { domain: {  } }
    end

    assert_redirected_to domain_url(Domain.last)
  end

  test "should show domain" do
    get dashboard_domain_url(@domain)
    assert_response :success
  end

  test "should get edit" do
    get edit_dashboard_domain_url(@domain)
    assert_response :success
  end

  test "should update domain" do
    patch dashboard_domain_url(@domain), params: { domain: {  } }
    assert_redirected_to domain_url(@domain)
  end

  test "should destroy domain" do
    assert_difference('Domain.count', -1) do
      delete dashboard_domain_url(@domain)
    end

    assert_redirected_to dashboard_domains_url
  end
end
