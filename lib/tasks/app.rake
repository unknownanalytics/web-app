require 'highline'
namespace :app do
  namespace :setup do
    task :create_user => :environment do
      ui = HighLine.new
      email = ui.ask("Email: ")
      password = ui.ask("Enter password: ") {|q| q.echo = false}
      confirm = ui.ask("Confirm password: ") {|q| q.echo = false}
      is_admin = false
      if agree("Is this user is admin ?  ", true)
        is_admin = true
      end
      if agree("This will create a new user on User table. Do you want to proceed?  ", true)
        user = User.new(:email => email, :password => password, :password_confirmation => confirm)
        if is_admin
          user.role = Role.find_by_name('admin')
        end
        if user.save false
          puts "User account '#{email}' created."
        else
          puts
          puts "Problem creating user account:"
          puts user.errors.full_messages
        end
      end
    end
  end
end