class TestingMailer < ActionMailer::Base
  default from: "support@souplus.com"
  
  def sign_up_confirmation(location, name, email)
    @location = location
    @name = name
    @email = email
    mail(:to => email, :subject => "Thank you for signing up on Souplus!") do |format|
      format.text
    end    
  end
  
  def sign_up_receipt(location, name, email)
    @location = location
    @name = name
    @email = email
    mail(:to => 'info@souplus.com', :subject => "You've got a new tester!") do |format|
      format.text
    end    
  end
  
end
