class PagesController < ApplicationController
  
  def games
  end
  
  def about
  end
  
  def career
  end
  
  def home
  end
  
  def testingStep1
  end
  
  def testingStep2
    @udid = params[:udid]
  end
  
  
  def testingStep3
    @tester = Tester.new
    @tester.udid = params[:udid]
    @tester.name = params[:name]
    @tester.email = params[:email]
    if @tester.save
      m = 'Congratulations! You will receive our latest app within the next few days :-)'
    else
      m = 'Doh! Something went wrong and your information was not stored properly. We will look into this issue ASAP!'
    end
    TestingMailer.sign_up_confirmation(@tester.udid, @tester.name, @tester.email).deliver
    TestingMailer.sign_up_receipt(@tester.udid, @tester.name, @tester.email).deliver
    respond_to do |format|
      format.json {render :json => {:message => m}.to_json}
    end    
  end
  
  
  def testingSignup
  end
  
end
