  var Locationapp = angular.module('Locationapp', []).filter('startFrom', function () {
    return function (input, start) {
        start = +start;
       if(input!=undefined)
        {return input.slice(start);}
    }
}); 

Locationapp.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);



  Locationapp.controller('locationController', function($scope,$http,$window,$rootScope) {
	   var socket = io();
	  $scope.username = $window.localStorage["username"];
			$scope.username=$scope.username.replace(/\"/g,""); 
			$scope.userid = $window.localStorage["userid"];
			$scope.userlevel = $window.localStorage["Userlevel"];
			$scope.userlevel = $scope.userlevel.replace(/\"/g,""); 
			$scope.supervisor = $window.localStorage["supervisor"];
			
			$scope.cartlength = 0;
			$scope.notificationcount = 0;
			
			$scope.CheckAttendanceStatus = function()
			{
				$http({
              method: 'GET'
              , url: 'api/getattendancestatus/'+$scope.userid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.AttendanceStatus = response.data;
			  if($scope.AttendanceStatus[0] != undefined)
			  {
			  if($scope.AttendanceStatus[0].status == 'in')
			  {
				  document.getElementById("attendance").style.color = "#4cff00";
			  }
			  }
		  });
			};
			
			 
			$scope.setMyAttendance = function()
			{
				navigator.geolocation.getCurrentPosition(showPosition);
				function showPosition(position) {
						  $http(
								{
									method: 'GET',
									url: "https://maps.googleapis.com/maps//api/geocode/json?latlng=" + position.coords.latitude + ","+ position.coords.longitude + "&sensor=true",
									dataType: 'jsonp'
								 }
							)
						  .then(function(response){
							  $scope.address=response.data.results[0].formatted_address;
						 
  
					   currentLocation = {
							userid : $scope.userid,
							lat : position.coords.latitude,
							lan : position.coords.longitude,
							address:$scope.address
						}; 
				$http({
				 method  : 'POST',
				 url     : 'api/userAttendance/',
				 data    : currentLocation,
				 headers : {'Content-Type': 'application/json'} 
			})
			.success(function(data) {
				$scope.CheckAttendanceStatus();
				if(data.status == 4)
				{
					localStorage.clear();
					$window.location.href="index.html";
					
				}
			});
			});
						  };
			};
			
			$scope.checkcurrpage=function(myValue){ 
			if(myValue == null)
				myValue = 1;
		if(!myValue){
		 window.document.getElementById("mypagevalue").value = $scope.currentPage+1;
		 var element = window.document.getElementById("mypagevalue");
		 if(element)
			 element.focus();
		$scope.currentPage = $scope.currentPage;
		$scope.myValue = null;
		}
		
		else{$scope.dispval = "";
		if(myValue-1 <= 0){
			$scope.currentPage=0;
		}else{$scope.currentPage=myValue-1;
				if(!$scope.currentPage){$scope.currentPage=0;}			}
		}};
		
		
		
		$scope.ListUser = function () {
          $http({
              method: 'GET'
              , url: 'api/userList/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.userList = response.data;
          });
		  
      };

		$scope.CheckAthentication = function()
		{
					if($window.sessionStorage["trackingstatus"] == 0)
				   {
					$('#myModalAuthenticate').modal('hide');  
				   }
				   else
				   {
						$('#myModalAuthenticate').modal({show:true,backdrop: 'static', keyboard: false});        
				   }
		};
		
	  $scope.AuthenticateAdmin = function (password) {
          $http({
              method: 'GET'
              , url: 'api/AuthenticateAdmin/'+$scope.userlevel+'/'+password
              , dataType: 'jsonp'
          }).then(function (response) {
			  console.log(response);
              if(response.data.status === 0)
			  {
					$window.sessionStorage["trackingstatus"] = response.data.status;
					$scope.CheckAthentication();
			  }
			  else
			  {
					$scope.authError = response.data.message;
			  }
          });
		  
      };
	  
/* 	  $scope.getOrderTrack = function (selecteduserid,orderdate) {
		  if(orderdate == undefined)
			  orderdate = new Date();
		  
		  var dd = orderdate.getDate();
		  if(dd < 10)
			  dd = "0"+dd;
		  var mm = orderdate.getMonth()+1;
		  if(mm < 10)
			  mm = "0"+mm;
		  var yy = orderdate.getFullYear();
		  orderdate = yy+"-"+mm+"-"+dd;
          
		  if(selecteduserid == undefined)
		  {	
				var url = window.location.href;
				var qparts = url.split("?");
				var passvar=qparts[1];
				selecteduserid = passvar;
		  }
		  location.href="./tracking.html?"+selecteduserid+"?"+orderdate;
		  
		  
      };
 */
	  $scope.getOrderTrack = function (selecteduserid,trackdate) {
				if(trackdate == undefined)
				{trackdate = new Date();}
		  
		  var dd = trackdate.getDate();
		  if(dd < 10)
			  dd = "0"+dd;
		  var mm = trackdate.getMonth()+1;
		  if(mm < 10)
			  mm = "0"+mm;
		  var yy = trackdate.getFullYear();
		  modifiedtrackdate = yy+"-"+mm+"-"+dd;
          
		   $http({
              method: 'GET'
              , url: 'api/TrackCurentPossitionWithUser/'+selecteduserid+'/'+modifiedtrackdate
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.userTrackList = response.data;
			  if($scope.userTrackList.status === 1)
			  {
				  alert($scope.userTrackList.message);
				  
			  }
		  else
		  {
			  
			//   console.log($scope.userTrackList)
					var map;
					var polyline;
					var markers = [];
					var i = $scope.userTrackList.length -1;
						
					// for(var i = 0 ; i < $scope.userTrackList.length;i++)
					{
						
						markers.push(new google.maps.LatLng($scope.userTrackList[i].orderlat,$scope.userTrackList[i].orderlan));
					}
					
					var moptions = {
        center: new google.maps.LatLng($scope.userTrackList[0].orderlat,$scope.userTrackList[0].orderlan),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    map = new google.maps.Map(document.getElementById("map"), moptions);
	
    var iconsetngs = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
    };
    var polylineoptns = {
        path: markers,
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map: map,
		icons: [{
			repeat: '70px',
            icon: iconsetngs,
            offset: '100%'}]
			
    };
	
	

	var infowindow = new google.maps.InfoWindow({Width: 1000});
    polyline = new google.maps.Polyline(polylineoptns);
var z = 0;
    var path = [];
    path[z] = polyline.getPath();
    for (var i = 0; i < $scope.userTrackList.length; i++) //LOOP TO DISPLAY THE MARKERS
    {
        var pos = markers[i];
        marker = new google.maps.Marker({
											position: new google.maps.LatLng($scope.userTrackList[i].orderlat,$scope.userTrackList[i].orderlan),
											map: map
										  });

										  google.maps.event.addListener(marker, 'click', (function(marker, i) {
											return function() {
											  infowindow.setContent("<table><tr><td><img src='images/usericon.png' style='height:55px;width:65px;padding-left:-10%;' class='img-responsive'/></td><td></td><td>"+" <p>Address:"+$scope.userTrackList[i].address+"<br> Username: "+$scope.userTrackList[i].username+"<br> Time: "+$scope.userTrackList[i].timing+"</p></td></tr></table>");
											  infowindow.open(map, marker);
											}
										  })(marker, i));
  //      path[z].push(marker.getPosition()); //PUSH THE NEWLY CREATED MARKER'S POSITION TO THE PATH ARRAY
    }
		  }  
          });
		 
      };
	  
	
				$scope.SendRequestToLocation= function(userid)
			{
				if(userid == undefined)
				{
					alert("Please select User First..");
				}
				else
				{
							socket.emit('Locationrequest',userid);
				}
			};
		
					socket.on('NewComplaint', function(data){
							$scope.getDashboardCount('Today'); 
							$scope.getAnualsalereport(); 
							$scope.getPopulerPlans(); 
					});	
					
					socket.on('Locationrequest', function(userid){
						
							if($window.localStorage["userid"] == userid)
							{
								 var options = {
						enableHighAccuracy: true,
						maximumAge: 3600000
					}
					
				navigator.geolocation.getCurrentPosition(showPosition, onError, options);
				function showPosition(position)
				{
					
					$http(
								{
									method: 'GET',
									url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + ","+ position.coords.longitude + "&sensor=true",
									dataType: 'jsonp'
								 }
							)
						  .then(function(response){
							  $scope.address=response.data.results[0].formatted_address;
								currentLocation = {
											userid : $window.localStorage["userid"],
											lat : position.coords.latitude,
											lan : position.coords.longitude,
											address:$scope.address
									}; 
					$http({
							    method  : 'POST',
								url     : 'api/UpdateCurrentLocation/',
								data    : currentLocation,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
					});
					});
				};
				 function onError(error) {
				//	alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
				}
				
				 update_trackdata();
				
							}
					});	
			
  });
  
  
  //COMMENTED CODE FOR GEO TRACKING User
  
  /* 
		 $(document).ready(function() {
								 
								  function update_trackdata() {

								$.getJSON('api/listCurentPossition/',function(data) { 
								
								console.log(data);
												for(var i = 0 ;i <data.length;i++)
												{
												if(data[i].loginstatus == 0 || data[i].loginstatus == null)
												{
													data[i].cin = 'images/redmarker.png'
												}
												else
												{
													data[i].cin = 'images/greenmarker.png'
												}
												}

										//var map = new google.maps.Map(document.getElementById('map'), {
										  //zoom: 10,
										 // center: new google.maps.LatLng(19.226662,72.983833),
										 // mapTypeId: google.maps.MapTypeId.ROADMAP
										//});

																					
var map;
var polyline;
var markers = [];
	
	
			polyline = new google.maps.Polyline(polylineoptns);
		var z = 0;
		var path = [];
		path[z] = polyline.getPath();
	
	
	for(var i = 0 ; i < data.length;i++)
	{
		
		markers.push(new google.maps.LatLng(data[i].lat,data[i].lan));
	}
	

    var moptions = {
        center: new google.maps.LatLng(19.226662,72.983833),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    map = new google.maps.Map(document.getElementById("map"), moptions);
	
    var iconsetngs = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
    };
    var polylineoptns = {
        path: markers,
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map: map,
		icons: [{
			repeat: '70px',
            icon: iconsetngs,
            offset: '100%'}]
			
    };
	
	
	var infowindow = new google.maps.InfoWindow({Width: 1000});
	
	
										
										var infowindow = new google.maps.InfoWindow();

										var marker, i;

										for (i = 0; i < data.length; i++) {  
										  marker = new google.maps.Marker({
											position: new google.maps.LatLng(data[i].lat, data[i].lan),
											map: map,
											icon:data[i].cin
										  });

										  google.maps.event.addListener(marker, 'click', (function(marker, i) {
											return function() {
											  infowindow.setContent("<table><tr><td><img src='images/usericon.png' style='height:55px;width:65px;padding-left:-10%;' class='img-responsive'/></td><td></td><td>"+" <p>Address:"+data[i].address+"<br> Username: "+data[i].username+"<br> Time: "+data[i].timing+"</p></td></tr></table>");
											  infowindow.open(map, marker);
											}
										  })(marker, i));
										}
									
					
					});
										return false;
										}
										
								
									$( "#refreshMap" ).click(function() {
									$( "#myselect" ).val('');
											update_trackdata();
											
									});
									$( ".target" ).change(function() {
								var selecteduserid = $( "#myselect" ).val();
						$.getJSON('api/listCurentPossitionWithUser/'+selecteduserid,function(data) { 
							for(var i = 0 ;i <data.length;i++)
								{
								if(data[i].loginstatus == 0 || data[i].loginstatus == null)
									{
										data[i].cin = 'images/redmarker.png'
									}
								else
									{
									data[i].cin = 'images/greenmarker.png'
									}
								}		
var map;
var polyline;
var markers = [];
	
	for(var i = 0 ; i < data.length;i++)
	{
		
		markers.push(new google.maps.LatLng(data[i].lat,data[i].lan));
	}
	

    var moptions = {
        center: new google.maps.LatLng(19.226662,72.983833),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    map = new google.maps.Map(document.getElementById("map"), moptions);
	
    var iconsetngs = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
    };
    var polylineoptns = {
        path: markers,
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map: map,
		icons: [{
			repeat: '70px',
            icon: iconsetngs,
            offset: '100%'}]
			
    };
	
	
	var infowindow = new google.maps.InfoWindow({Width: 1000});
	
		polyline = new google.maps.Polyline(polylineoptns);
		var z = 0;
		var path = [];
		path[z] = polyline.getPath();
		for (var i = 0; i < data.length; i++) //LOOP TO DISPLAY THE MARKERS
		{
			var pos = markers[i];
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(data[i].lat,data[i].lan),
			map: map,
			icon:data[i].cin
		});

		google.maps.event.addListener(marker, 'click', (function(marker, i) {
			return function() 
	{
				infowindow.setContent("<table><tr><td><img src='images/usericon.png' style='height:55px;width:65px;padding-left:-10%;' class='img-responsive'/></td><td></td><td>"+" <p>Address:"+data[i].address+"<br> Username: "+data[i].username+"<br> Time: "+data[i].timing+"</p></td></tr></table>");
		infowindow.open(map, marker);
				}
			})(marker, i));
				  path[z].push(marker.getPosition()); //PUSH THE NEWLY CREATED MARKER'S POSITION TO THE PATH ARRAY
				  }
										});
										return false;
										
												});
												
											<!-- var interval = setInterval(update_trackdata, 40000); -->
										
										});
  */