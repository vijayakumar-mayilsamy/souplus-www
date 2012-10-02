class TestersController < ApplicationController
  http_basic_authenticate_with :name => "jumbo", :password => "austinhouston", :except => [:emailExistsAPI, :createAPI]
  

  
  def index
    @testers = Tester.all
    respond_to do |format|
      format.html
    end
  end
  
  def emailExistsAPI
    respond_to do |format|
      format.json {render :json => {:available => Tester.find_by_email(params[:email]).nil?}.to_json}
    end    
  end
  
  def createAPI
    @tester = Tester.new
    @tester.location = params[:location]
    @tester.name = params[:name]
    @tester.email = params[:email]
    if @tester.save
      m = 'Congratulations! You will receive our invitation within the next few days :-)'
    else
      m = 'Doh! Something went wrong and your information was not stored properly. We will look into this issue ASAP!'
    end
    TestingMailer.sign_up_confirmation(@tester.location, @tester.name, @tester.email).deliver
    TestingMailer.sign_up_receipt(@tester.location, @tester.name, @tester.email).deliver
    respond_to do |format|
      format.json {render :json => {:message => m}.to_json}
    end    
  end
  
end
