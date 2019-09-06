class SendUserNewApiKeyCreationJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    user = User.find(user_id)
    UserMailer.new_api_key_creation(user).deliver_now
  end
end
