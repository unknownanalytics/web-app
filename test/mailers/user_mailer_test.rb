require 'test_helper'

class UserMailerTest < ActionMailer::TestCase
  test "new_api_key_creation" do
    mail = UserMailer.new_api_key_creation
    assert_equal "New api key creation", mail.subject
    assert_equal ["to@example.org"], mail.to
    assert_equal ["from@example.com"], mail.from
    assert_match "Hi", mail.body.encoded
  end

end
