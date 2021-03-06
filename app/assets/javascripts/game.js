

String.prototype.trim = function(){
	return decodeURIComponent(this).replace(/^\s+|\s+$/g,"");
}

var autoRefresh = null,  
	autorefreshTimer = 10000,
	default_tab = 0;
var map;	
var game = {
	url: 'http://engine.souplus.com/api/rankings.json?tab=',
	token: function(){
		return $.cookie('token');
	},
	sessionOut: function(){
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
		});
	}, 
	get_listItems:function(tabid){
		
		if(!this.token()) this.sessionOut();
		
		autoRefresh = clearInterval(autoRefresh);
		var href = $('#games_tab li a:eq('+tabid+')').attr('href'),
			id = href.substr(1,href.length);
		this.settoRefresh(tabid);
		window.location. hash = href;
		$.getJSON(this.url + id, function(response) {
			  var items = [],
				  data = response.data;

			  items.push('<table class="game_table"><tr><th>Ranking</th><th>Name</th><th>Miles</th><th style="width:110px;">Soups (check in)</th></tr>');
			  for (item in data) {
				  var d = data[item],
   					  rank = d.ranking,
   					  name = d.name,
   					  miles = d.mileage,
   					  soups = d.soups;
   				  items.push('<tr class="'+((item%2) == 0 ?'game_table_oddrows':'game_table_evenrows')+'"><td>'+rank+'</td><td>'+name+'</td><td>'+miles+'</td><td>'+soups+'</td></tr>');	  
			  }
			  items.push('</table>'); 	
			  $('#'+id).html(items.join(""));	
			});
			this.getDirections(id);	
	},	
	colorLuminance: function(hex, lum) {
		// validate hex string
		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		if (hex.length < 6) {
			hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		}
		lum = lum || 0;
		// convert to decimal and change luminosity
		var rgb = "#", c, i;
		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i*2,2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			rgb += ("00"+c).substr(c.length);
		}
		return rgb;
	},
	getDirections: function(id){
		$.getJSON('http://engine.souplus.com/api/trips.json?tab=' + id, function(response) {
			  var data = response.data,
				collection = [];
				//console.log(data);
				if (GBrowserIsCompatible()) {
			
					// Make sure that SVG is on.
					if (document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#SVG", "1.1")) {
						_mSvgEnabled = true;
						_mSvgForced = true;
					}
					// Create an instance of Google map
					//map = new GMap2(document.getElementById("map_canvas"));

					// Tell the map where to start
					// Loop through the coordinates.
					// In this case the coordinates are in a JSON object 
					var map = new google.maps.Map(document.getElementById("map_canvas"),{zoom: 11,
					  center: new google.maps.LatLng(30.371523, -97.756401),
					   mapTypeId: google.maps.MapTypeId.ROADMAP
					});
					for (item in data) {
						  var points = [];	
						  var d = data[item];
						  //console.log(d);
						  for(a in d){
							 points.push(new google.maps.LatLng(d[a].lat, d[a].lng));
						  }
							//console.log(points + '/' +'#'+Math.floor(Math.random()*16777216).toString(16));
							  mapLine = new google.maps.Polyline({map : map,strokeColor   : game.colorLuminance('#'+Math.floor(Math.random()*16777215).toString(16), -0.5),
							   strokeOpacity : 0.6, strokeWeight  : 4,
							   path:points
						   });
						   //mapLine.runEdit(false);
					}
				}
		});
	},
	settoRefresh: function(id){
		var totalTabs = $('#games_tab li a').length;
		var tabid = (id == totalTabs - 1)?0:parseInt(id) + 1;
		autoRefresh = setInterval("game.triggerClick('"+tabid+"');",autorefreshTimer);
	},
	triggerClick: function(tabid){
		$('#games_tab li a:eq('+tabid+')').trigger('click');
	},
	settabActions: function(){
	    $('.nav li a').bind('click',function(){
			var href = $(this).attr('href');
			//console.log($('#games_tab li a').index($(this)));
			game.get_listItems($('#games_tab li a').index($(this)));
		});
	},
	googleMap: function(collection){
	    //$('#map_canvas').html('<iframe src="http://maps.googleapis.com/maps/api/staticmap?size=480x480&markers=icon:http://chart.apis.google.com/chart?chst=d_map_pin_icon&path=color:0x0000ff|weight:5|'+collection.join("|")+'&sensor=true" frameborder="0" style="width:500px;height:400px;"></iframe>');
	},
	featuredGame: function(data){
		var items = [];
		items.push('<div class="row-fluid round" style="padding:5px;"><h2>Featured Game</h2>');
		//for (item in data) {
			  var d = data[0],
				  id = d.id,	
				  title = d.title,
				  team_id = d.user_team_id,
				  tier = d.tier,
				  mileage_all = d.mileage_all,
				  winning_team = d.winning_team,
				  w_mileage = winning_team.mileage_all,
				  w_name = winning_team.name,
				  w_ismember = winning_team.is_member,
				  losing_team = d.losing_team,
				  l_mileage = losing_team.mileage_all,
				  l_name = losing_team.name,
				  l_ismember = losing_team.is_member;
				  
				  items.push('<div class="row-fluid"><div class="span12"><div class="span4"><div class="span6"><img src="/assets/testing/fea_i2.jpg" style="width:100px;height:150px;" /><p>'+w_mileage+' miles</p></div><div class="span6"><img src="/assets/testing/fea_i1.jpg" style="width:100px;height:150px;" /><p>'+l_mileage+' miles</p></div></div><div class="span3"><h3><span style="color:#B94A48;">'+w_name+'</span> Vs <span  style="color:#58c;">'+l_name+'</span></h3><p>Finish Date: 10/31</p><br /><p><a class="btn btn-primary" href="/viewgame?game_id='+id+'">View Game</a></p><a class="btn btn-primary" onclick="game.joinGame(this,&quot;'+tier+'&quot;,&quot;'+team_id+'&quot;)">Join Game</a></p></div><div class="span5" style="font-size:15px;"><p>Winning campaign&apos;s SuperPAC will receive </p><p style="color:#B94A48;font-weight:bold;">$5,380,840 </p><p>donation from Souplus Inc.</p></div></div></div>');
		 // }
		  items.push('</div>');
		   $('#home').append(items.join(""));	
	},
	allGames: function(data){
		var items = [];	
		items.push('<div class="row-fluid"><h2>All Games</h2><div class="row-fluid">');
		for (item in data) {
			  var d = data[item],
				  id = d.id,
				  title = d.title,	
				  team_id = d.user_team_id,
				  tier = d.tier,
				  mileage_all = d.mileage_all,
				  winning_team = d.winning_team,
				  w_mileage = winning_team.mileage_all,
				  w_name = winning_team.name,
				  w_ismember = winning_team.is_member,
				  losing_team = d.losing_team,
				  l_mileage = losing_team.mileage_all,
				  l_name = losing_team.name,
				  l_ismember = losing_team.is_member;
				  /*if(item == 0 || item%3 == 0){
					items.push('<div class="span12">');	
				  }*/
				  items.push('<div class="span4 round" style="padding:5px;margin:10px 5px;min-height:165px;"><div class="span12"><div class="span8"><div class="span12 btn" style="position:relative;top:-21px;padding-top:7px;"><a href="/viewgame?game_id='+id+'">'+title+'</a></div><div class="span12"><div class="span5"><span style="color:#B94A48;">'+w_name+'</span></div><div class="span2"> Vs </div><div class="span5"><span style="color:#58c;">'+l_name+'</span></div></div><div class="span12"><div class="span6"><img src="/assets/testing/game1_1.jpg" style="width:50px;height:50px;" /></div><div class="span6"><img src="/assets/testing/game1_2.jpg" style="width:50px;height:50px;" /></div></div><div class="span12"><div class="span6">'+w_mileage+' miles</div><div class="span6">'+l_mileage+' miles</div></div></div><div class="span4"><br /><br /><br /><p>Finish Date</p><p><a class="btn btn-primary" href="/viewgame?game_id='+id+'">View Game</a></p><p><a class="btn btn-primary" onclick="game.joinGame(this,&quot;'+tier+'&quot;,&quot;'+team_id+'&quot;)">Join Game</a></p></div></div></div>');
		 }
		  items.push('</div></div>');
		  $('#home').append(items.join(""));	
	},
	home: function(){
		alert(3);
		if(!this.token()){
			this.sessionOut();
			
			$("#modal_overlay").show();
			$("#signin-modal").modal('show');
		}	
		else {
			$.getJSON('http://engine.souplus.com/api/games.json?token=' + this.token(), function(response) {
				  var data = response.data;
				  //alert(game.token());
					game.featuredGame(data);
					game.allGames(data);
			});		
		}
	},
	viewGame: function(game_id){
		//if(!this.token()) this.sessionOut();
		//alert('http://engine.souplus.com/api/games/profile.json?game_id='+game_id.trim()+'&token=test');	
		$.getJSON('http://engine.souplus.com/api/games/profile.json?game_id='+game_id.trim(), function(response) {
			 // alert(response.data);	
			  var data = response.data,
				  d = data, 
				  id = d.id,
				  title = d.title,	
				  team_id = d.user_team_id,
				  tier = d.tier,
				  mileage_all = d.mileage_all,
				  winning_team = d.winning_team,
				  w_mileage = winning_team.mileage_all,
				  w_name = winning_team.name,
				  w_member_count = winning_team.members_count,
				  w_ismember = winning_team.is_member,
				  losing_team = d.losing_team,
				  l_mileage = losing_team.mileage_all,
				  l_name = losing_team.name,
				  l_member_count = losing_team.members_count,
				  l_ismember = losing_team.is_member,
				  total_members = w_member_count + l_member_count;
			  $('#game_title').html(' <h1 class="well">'+title+'</h1>');	
			  $('#game_meta').html('<div class="span5"><h2 style="color:#B94A48;"><a>'+w_name+'</a></h2><a ><img src="/assets/testing/fea_i2.jpg" style="width:100px;height:150px;" /></a></div><div class="span2" style="margin:0;padding:0;"><h2>Vs</h2></div><div class="span5"><h2 style="color:#58c;">'+l_name+'</h2><img src="/assets/testing/fea_i1.jpg" style="width:100px;height:150px;" /></div>');	
   			 $('#game_mileages').html('<div class="span5"><div class="span12"><div style="height:18px;border:1px solid #000;"><div style="width:'+((w_mileage/mileage_all)*100)+'%;background:#B94A48;">&nbsp;</div></div><p>'+w_mileage+' Miles</p><div style="height:18px;border:1px solid #000;"><div style="width:60%;background:#58c;">&nbsp;</div></div><p>'+w_member_count+' Soupies</p></div></div></div><div class="span2">&nbsp;</div><div class="span5"><div class="span12"><div style="height:18px;border:1px solid #000;"><div style="width:'+((l_mileage/mileage_all)*100)+'%;background:#69c;">&nbsp;</div></div><p>'+l_mileage+' Miles</p><div style="height:18px;border:1px solid #000;"><div style="width:80%;background:#39c;">&nbsp;</div></div><p>'+l_member_count+'  Soupies</p></div></div></div>');
   			 $('#game_cta').append('<a class="btn btn-primary" onclick="game.joinGame(this,&quot;'+tier+'&quot;,&quot;'+team_id+'&quot;)">Join Game</a>');
		});		
	},	
	joinGame: function(el,tier_id,team_id){
		if(!this.token()) this.sessionOut();
		
		$.getJSON('http://engine.souplus.com/api/games/join.json?token='+this.token()+'&team_id='+team_id+'&tier_id='+tier_id, function(data) {
			 	if(data.status == 'success'){
					
				} else {
					alert(data.message);
				}	
		});	
	},
	init: function(){
	    this.get_listItems(default_tab);	
	    this.settabActions();
	}
};
