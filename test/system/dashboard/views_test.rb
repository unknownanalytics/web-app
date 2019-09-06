require "application_system_test_case"

class Dashboard::ViewsTest < ApplicationSystemTestCase
  setup do
    @dashboard_view = dashboard_views(:one)
  end

  test "visiting the index" do
    visit dashboard_views_url
    assert_selector "h1", text: "Dashboard/Views"
  end

  test "creating a View" do
    visit dashboard_views_url
    click_on "New Dashboard/View"

    click_on "Create View"

    assert_text "View was successfully created"
    click_on "Back"
  end

  test "updating a View" do
    visit dashboard_views_url
    click_on "Edit", match: :first

    click_on "Update View"

    assert_text "View was successfully updated"
    click_on "Back"
  end

  test "destroying a View" do
    visit dashboard_views_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "View was successfully destroyed"
  end
end
