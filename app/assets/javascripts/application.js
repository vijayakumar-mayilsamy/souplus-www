
// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

//var API_DOMAIN = 'http://dashboard.souplus.com/api'

var GOOGLE_API_KEY = 'AIzaSyBmS6_GBK6Wlf9oZIAFls1CbnkYfxRrg7E';
//var API_DOMAIN = 'http://dashboard.souplus.com/api';
var API_DOMAIN = 'http://engine.souplus.com';
// var FB_APP_ID = '341522109266875';
var FB_APP_ID = '408860775839574';

function enableContactForm(){	
	$('#contact').click(function(e){
		e.preventDefault();
		var wrapper = $('<div id="feedback-wrapper"></div>').hide().appendTo('#footer-wrapper').fadeIn();
		$('<h1></h1>').html('We love to hear from you!').appendTo(wrapper);
		var form = $('<div id="feedback-form"></div>').appendTo(wrapper);
		var email = $('<div class="form-field"></div>').appendTo(form);
		var email_label = $('<label></label>').html('Your email').appendTo(email);
		var email_input = $('<input type="text" size="40">').appendTo(form);
		var message = $('<div class="form-field"></div>').appendTo(form);
		var message_label = $('<label></label>').html('Message').appendTo(message);
		var message_input = $('<textarea type="text" cols="37" rows="7">').appendTo(form);
		var actions = $('<div class="form-actions"></div>').appendTo(form);
		var submit = $('<a class="form-actions-submit" id="feedback-submit-button" href="#"></a>').html('Send').appendTo(actions);
		$(submit).click(function(e){
			e.preventDefault();
			$.ajax({
				url: API_DOMAIN+'/feedback.json?email='+escape($(email_input).val())+'&message='+escape($(message_input).val()),
				beforeSend: function(){
					$(form).html('loading...');
				},
				success: function(obj){
					$(form).empty();
					if (obj.status=='success'){
						$(form).html('Thank you for the message!');
					}else{
						$(form).html('Sorry, something went wrong on our server! You can write to support@souplus.com instead.');
					}
				}
			})
		})
		var cancel = $('<a href="#" class="form-actions-cancel" id="feedback-cancel-button"></a>').html('Close').prependTo(wrapper);
		$(cancel).click(function(e){
			e.preventDefault();
			$(wrapper).fadeOut(function(){
				$(this).remove();
			})
		});
		
	})
}


var userBar = {	
	refresh: function(score_update, appetite_update){
		//scoreBoard.refresh(score_update, appetite_update);
		var userBar = this;
		//alert(2);
		var token = $.cookie('token');
		//alert(token);
		if (token!=null){
			$.ajax({
				url: API_DOMAIN+'/api/users/profile.json?token='+token,
				dataType: 'json',
				beforeSend: function(){
					$('#user-bar').empty().fadeIn().loading();
				},
				success: function(data){
					$('#user-bar').empty().unloading();	
					//alert(data.status);			
					if (data.status=='success'){									
						var username = $('<a href="#" id="username-link"></a>').html(data.user_api.name);
						$('<li></li>').append(username).appendTo('#user-bar');

						$(username).click(function(e){
							e.preventDefault();
							if ($('#user-nav').length>0){
								$('#user-nav').slideUp('normal', function(){ $(this).remove();});
							}else{
								showUserNav(data.user_api.username);
							}

						});
					}else{
						if (data.status=='fail'){
							alert('Did you sign in somewhere else?');
						}else{
							alert('Oops, this is embarrassing. We will work on this error asap!');
						}						
						userBar.refresh(false, false);
						$.cookie('token',null, {path:'/'});
						// $('<li></li>').html('Did you sign in somewhere else?').appendTo('#user-bar');
					}
				}
			})

		}else{

			$('#user-bar').empty();
			var signin = $('<a id="signin-link" class="btn btn-primary" onclick="$(&quot;#signin-modal&quot;).modal(&quot;show&quot;);"> Sign In </a>');
			$('<li> </li>').append(signin).appendTo('#user-bar');
			var signup = $('<a href="/signup/to-be-verified" id="signup-link"  class="btn btn-primary"> Sign Up </a>');
			$('<li> </li>').append(signup).appendTo('#user-bar');
			
			$(signin).click(function(e){
				e.preventDefault();
				if ($('#signin-modal').length>0){
					$('#signin-modal').slideUp('normal', function(){ $(this).remove();});
					
				}else{
					showSigninForm();
				}
			})					
		}		
	}
}

function showUserNav(username){
	var root = $('<ul id="user-nav"></ul>');
	$('<li></li>').html('<a href="/@'+username+'">Profile</a>').appendTo(root);
	var signout = $('<a href="" id="signout-link">Sign Out</a>');
	$(signout).click(function(e){
		e.preventDefault();
		$.cookie('token',null, { path: '/' });
		/*/api/users/logout.json?token=token*/
		userBar.refresh(false, false);
		$(root).slideUp();
		if ($('#dishes-wrapper').length>0){
			unlockWrapper.refresh();
			dishesWrapper.refresh();											
		}		
	})
	$('<li></li>').append(signout).appendTo(root);
	
	$(root).hide().appendTo('#header-score').slideDown();

}

function showSigninForm(){
	var root = $('<div id="signin-modal" class="modal well"><form class="form-horizontal"><fieldset><legend>Login</legend><div class="control-group"><label class="control-label" for="focusedInput">Email</label><div class="controls"><input class="focused" id="souplus_email" type="text" value=""></div></div><div class="control-group"><label class="control-label">Password</label><div class="controls"><input id="souplus_pwd" type="text" value=""></div></div><div style="padding:5px;text-align:center;"><button type="submit" id="signin-submit" style="margin:2px;">Sign in</button><button type="submit" id="signin-cancel" style="margin:2px;">Cancel</button></div></fieldset></form></div>');
	$('body').append(root);
	
	$('#signin-modal').css('display','').show();
	$('#souplus_pwd').keypress(function(e){
		if(e.keyCode==13){
			submitSigninForm();
		}
	})
	$('#signin-submit').click(function(e){
		e.preventDefault();
		submitSigninForm();
	})
	
	function submitSigninForm(){
		var email_val = $('#souplus_email').val();
		var password_val = $('#souplus_pwd').val();
		$.ajax({
			url: API_DOMAIN + '/api/users/login.json?email='+email_val+'&password='+password_val,
			dataType: 'json',
			beforeSend: function(){
				$(root).loading();
			},
			success: function(data){
				//alert(data);
				$(root).unloading();
				if (data.status=='success'){
					$(root).slideUp();
					$.cookie('token',data.token, {expires: 7, path: '/'});
					userBar.refresh(false, false);
					if ($('#dishes-wrapper').length>0){
						unlockWrapper.refresh();
						dishesWrapper.refresh();											
					}
				}else{
					$(root).html('Wrong email or password');
				}
				
			}
		})
	}
	
	$('#signin-cancel').click(function(e){
		e.preventDefault();
		$(root).slideUp();
	})
	$('<div class="or-wrapper">or</div><div id="fb-signin-wrapper"><a href="https://www.facebook.com/dialog/oauth?client_id='+FB_APP_ID+'&redirect_uri='+window.location+'&scope=email,user_checkins&response_type=token"><img src="/assets/f_logo.png" />Facebook Sign in</a></div>').appendTo(root);
}

jQuery.fn.loading = function(){
	var root = this;
	$(root).html('Loading...').addClass('loading');
}

jQuery.fn.unloading = function(){
	var root = this;
	$(root).removeClass('loading');
}


function errorMessage(m){
	$('<div id="message-wrapper" class="error"></div>').append($('<div id="message"></div>').html(m)).hide().prependTo($('#content')).slideDown();
}

function resetMessage(){
	$('.invalid-input').removeClass('invalid-input');
	$('#message-wrapper').remove();
}

$(document).ready(function(){
	userBar.refresh(false, false);	
	//enableFeedbackForm();
});
