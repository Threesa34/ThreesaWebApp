  var loginApp = angular.module('loginApp', ['ui.bootstrap']).filter('startFrom', function () {
    return function (input, start) {
        start = +start;
		if(input!=undefined)
        {return input.slice(start);}
    }
});
  loginApp.controller('loginController', function($scope, $http,$window) {   
  
			var socket = io();
	
	
				socket.on('serverEvent', function(data){
					socket.emit('disconnect',data);
					});
					
					$scope.LeavesList = function()
				{
					$scope.LeavesNotification = [];
			$http({
              method: 'GET'
              , url: 'api/LeavesList/'+$scope.userid+'/'+$scope.userlevel
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.LeavesListing = response.data;
			  for(var i = 0 ; i < $scope.LeavesListing.length;i++)
			  {
				  if($scope.LeavesListing[i].notificationread == 0)
				  {
					 $scope.LeavesNotification.push($scope.LeavesListing[i]) ;
				  }
			  }
		  });
		};
					
					socket.on('LeaveEntry', function(leavedata){
								if(leavedata.action == 'Insert')
								{
							var dd = new Date(leavedata.fromdate).getDate();
							if(dd< 10)
								dd = '0'+dd;
							var mm = new Date(leavedata.fromdate).getMonth() +1;
							if(mm <10)
								mm = '0'+mm;
							var yy = new Date(leavedata.fromdate).getFullYear();
							fromdate = dd+'/'+mm+'/'+yy;
							
							var ddto = new Date(leavedata.todate).getDate();
							if(ddto < 10)
								ddto = '0'+ddto;
							var mmto = new Date(leavedata.todate).getMonth() +1;
							if(mmto <10)
								mmto = '0'+mmto;
							var yyto = new Date(leavedata.todate).getFullYear();
							todate = ddto+'/'+mmto+'/'+yyto;
						 if("Notification" in window)
							{
								if(Notification.permission == "granted")
								{
									var message = leavedata.username+" on Leave from "+fromdate+' to '+ todate;
									var notification = new Notification(message, {"body":"Threesa Infoway", "icon":"images/globe.png"});
								}
								else
								{
									Notification.requestPermission(function (permission) {
									if (permission === "granted") 
										{
											var message = leavedata.username+" on Leave from "+fromdate+' to '+ todate;
											
											var notification = new Notification(message, {"body":"Threesa Infoway", "icon":"images/globe.png"});
										}
									});
								}
								document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="images/alarm.mp3" type="audio/mpeg" /><embed hidden="true" autostart="true" loop="false" src="images/alarm.mp3" /></audio>';
							}   
							else
							{
								alert("Your browser doesn't support notfication API");
							}     
						$scope.LeavesList();
								}
								else
								{
									$scope.LeavesList();
								}
					});
			
	
	  $scope.uneditablefullname = true;
	  $scope.uneditableUsername = true;
	  $scope.uneditableemail = true;
	  $scope.uneditablephone = true;
	  $scope.normview = true;
	
			$scope.cartlength = 0;
			$scope.notificationcount = 0;
			
			
			var thisdate = new Date();
			var dd = thisdate.getDate();
			if(dd < 10)
				dd = '0'+dd;
			var mm = thisdate.getMonth() +1;
			if(mm < 10)
				mm = '0'+mm;
			var yy = thisdate.getFullYear();
			$scope.Currdate = dd+'-'+mm+'-'+yy;
			
			
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
	
  $scope.errormsg = false;
 
		$scope.submitForm = function() {
  $http({
         method  : 'POST',
         url     : 'api/user/auth',
         data    : $scope.user,
         headers : {'Content-Type': 'application/json'} 
    })
    .success(function(data) {
      if (!data.success) {
        $scope.errormMessage = data.message;
          $scope.errormsg = true;
      } else {
      $window.localStorage["token"] = JSON.stringify(data.token);
      $window.localStorage["username"] = JSON.stringify(data.username);
      $window.localStorage["userid"] = JSON.stringify(data.userId);
      $window.localStorage["Userlevel"] = JSON.stringify(data.Userlevel);
      $window.localStorage["supervisor"] = JSON.stringify(data.supervisor);
    
			$scope.username = $window.localStorage["username"];
			$scope.username=$scope.username.replace(/\"/g,""); 
			$scope.userid = $window.localStorage["userid"];
			$scope.userlevel = $window.localStorage["Userlevel"];
			$scope.userlevel = $scope.userlevel.replace(/\"/g,""); 
			$scope.supervisor = $window.localStorage["supervisor"];
			
		
	
			
				if ($scope.userlevel == 'HO'){
					$window.location.href='./Dashboard.html';
					} else {
						$window.location.href='./Dashboard.html';
					}
				}
			});
	};
	
	if($window.localStorage["username"] != undefined &&  $window.localStorage["userid"] != undefined)
	{
		$scope.username = $window.localStorage["username"];
			$scope.username=$scope.username.replace(/\"/g,""); 
			$scope.userid = $window.localStorage["userid"];
			$scope.userlevel = $window.localStorage["Userlevel"];
			$scope.userlevel = $scope.userlevel.replace(/\"/g,""); 
			$scope.supervisor = $window.localStorage["supervisor"];
	}

			
	
	
	$scope.ListUserData = function () {
	      $http({
              method: 'GET'
              , url: 'api/userList/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.userDataList = response.data;
			  console.log($scope.userDataList);
			  $scope.currentPage = 0;
					$scope.pageSize = 50;
					if($scope.myValue > $scope.userDataList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.userDataList.length / $scope.pageSize);
		};
			  
          });
		  
      };
	  
	  $scope.setPage = function (pageNo) {
			 $scope.currentPage = pageNo;
				};
			 $scope.filter = function () {
			 $timeout(function () {
			 $scope.filteredItems = $scope.userList.length;
				}, 10);
			};
			$scope.sort = function (column) {
			if ($scope.orderProp === column) {
            $scope.direction = !$scope.direction;
			} else {
            $scope.orderProp = column;
            $scope.direction = false;
			}
		};
		
	  $scope.getUserData = function (userid) {
          $http({
              method: 'GET'
              , url: 'api/userdetails/'+userid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.userDetails = response.data;
			  console.log($scope.userDetails);
          });
		  
      };
	  
	  
	  $scope.getAttendanceList = function(date)
	  {
		  $scope.mydate = date;
		  var dd = date.getDate();
		  if(dd < 10)
			  dd = '0'+dd;
		  var mm = date.getMonth() + 1;
		  if(mm < 10)
			  mm = '0'+mm;
		  var yy = date.getFullYear();
		  var fulldate = dd+'-'+mm+'-'+yy;
		   $http({
            method: 'GET'
            , url: 'api/userAttendanceList/' + fulldate
            , dataType: 'jsonp'
        }).then(function (response) {
            $scope.userAttendanceList = response.data;
			
			$scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.userAttendanceList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.userAttendanceList.length / $scope.pageSize);
    };
			
		});
	  }
	  
	  $scope.getAbenceList = function(date)
	  {
		  if(date == undefined)
		  {
		  $scope.mydate = new Date();
		  }
		  else
		  {
		  $scope.mydate = date;
		  }
		  var dd = $scope.mydate.getDate();
		  if(dd < 10)
			  dd = '0'+dd;
		  var mm = $scope.mydate.getMonth() + 1;
		  if(mm < 10)
			  mm = '0'+mm;
		  var yy = $scope.mydate.getFullYear();
		  $scope.fulldate = dd+'-'+mm+'-'+yy;
		   $http({
            method: 'GET'
            , url: 'api/getAbenceList/' +  $scope.fulldate
            , dataType: 'jsonp'
        }).then(function (response) {
            $scope.userAbsentList = response.data;
			$scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.userAbsentList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.userAbsentList.length / $scope.pageSize);
    };
			
		});
	  }
      $scope.getAttendanceList(new Date());
      $scope.getAbenceList(new Date());

	  $scope.resetAttendance = function (userid) {
          $http({
              method: 'GET'
              , url: 'api/resetAttendance/'+userid
              , dataType: 'jsonp'
          }).then(function (response) {
               $scope.getAttendanceList(new Date());
          });
		  
      };
	  
	  $scope.GetAttendancerecord = function (userid) {
          $http({
              method: 'GET'
              , url: 'api/GetAttendancerecord/'+userid
              , dataType: 'jsonp'
          }).then(function (response) {
               $scope.UserAttrecord = response.data;
			   console.log($scope.UserAttrecord);
               $scope.UserAttrecord[0].intime = new Date($scope.UserAttrecord[0].intime);
          });
		  
      };
	  
	   $scope.resetAttendanceintime = function() {
		   var indianTimeZoneVal = ($scope.UserAttrecord[0].intime).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj = new Date(indianTimeZoneVal);
					indainDateObj.setHours(indainDateObj.getHours() + 5);
					indainDateObj.setMinutes(indainDateObj.getMinutes() + 30);
					$scope.UserAttrecord[0].intime = indainDateObj;
			  $http({
					 method  : 'POST',
					 url     : 'api/resetAttendanceintime',
					 data    : $scope.UserAttrecord,
					 headers : {'Content-Type': 'application/json'} 
				})
				.success(function(data) {
					alert(data.message);
					$scope.getAttendanceList(new Date());
				});
			  };
	  
	  
	  $scope.DeleteUser = function (userid) {
		  var yes = confirm("Are You Sure?")
		  if(yes)
		  {
          $http({
              method: 'DELETE'
              , url: 'api/userdelete/'+userid
              , dataType: 'jsonp'
          }).then(function (response) {
			  alert(response.data.message);
                  $scope.ListUser();
          });
		  }
		  else
		  {}
		  
      };
	  
	  
	$scope.userlevelarray = ['HO','OFFICE','FIELD','SUPERVISOR','STOCK  MANAGER','SALES EXICUTIVE','ACCOUNT HEAD','COLLECTION MAN','SHOP MANAGEMENT'];
	
	$scope.ListCustomers = function()
			{
				$http({
              method: 'GET'
              , url: 'api/ListCustomers/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.CustomerList = response.data;
			  console.log($scope.CustomerList);
		  });
			};
			
	  $scope.getsupervisordetails = function (userlevel) {
          $http({
              method: 'GET'
              , url: 'api/userlevelcheck/'+userlevel
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.supervisordetailsarr = response.data;
          });
		  
      };
         $scope.getCustomerData = function(item)
		 {
			$scope.entityid = item.id; 
		 }
		
		$scope.newUser = function() {
			if($scope.user.userlevel != 'HO' && $scope.user.supervisor == undefined)
			{
			 document.getElementById("supervisor").style.borderColor = "red";
			}
			else
			{
				$scope.user.entityid = $scope.entityid;
				
				document.getElementById("supervisor").style.borderColor = "";
  $http({
         method  : 'POST',
         url     : 'api/user/',
         data    : $scope.user,
         headers : {'Content-Type': 'application/json'} 
    })
    .success(function(data) {
      if (!data.success) {
        $scope.formMessage = data.message;
        alert("Thank U ! You are Successfully Regestered.");
					$scope.user = {};
                  $scope.ListUser();
      } else {
          alert("Something Wrong ! please fill form again.");
      }
    });
			}
  };
  
  $scope.EditUser = function() {
  $http({
         method  : 'POST',
         url     : 'api/userEdit/',
         data    : $scope.userDetails,
         headers : {'Content-Type': 'application/json'} 
    })
    .success(function(data) {
				alert(data.message);
                  $scope.ListUser();
    });
  };
	  
	  $scope.UploadUsers = function(userdetails) {
  $http({
         method  : 'POST',
         url     : 'api/UploadUsers/',
         data    : userdetails,
         headers : {'Content-Type': 'application/json'} 
    })
    .success(function(data) {
				alert(data.message);
                  $scope.ListUser();
    });
  };
	  
	  
	  $scope.EditProfileUsername = function(field,value,id) {
  $http({
         method  : 'POST',
         url     : 'api/userProfileEdit/'+field+'/'+value+'/'+id,
         headers : {'Content-Type': 'application/json'} 
    })
    .success(function(data) {
      if (!data.success) {
        $scope.formMessage = data.message;
		  $window.localStorage["username"] = JSON.stringify(value);
          $window.location.reload();
       
      } else {
         
      }
    });
  }; 
	  $scope.EditProfile = function(field,value,id) {
  $http({
         method  : 'POST',
         url     : 'api/userProfileEdit/'+field+'/'+value+'/'+id,
         headers : {'Content-Type': 'application/json'} 
    })
    .success(function(data) {
      if (!data.success) {
        $scope.formMessage = data.message;
      } else {
         
      }
    });
  };
      $scope.checklocalstorage = function()
	  {
	  if($scope.username != undefined && $scope.userid != undefined && $scope.userlevel != undefined)
	{
		    $scope.username=$scope.username.replace(/\"/g,"");
			$scope.userlevel = $scope.userlevel.replace(/\"/g,""); 
			
			location.href="./Dashboard.html";			
	}
	  }
      //    FORGOT PASSWORD
    
     $scope.verifyuser = function (usercheck) {
          $http({
              method: 'GET'
              , url: 'api/userduplicatecheck/' + usercheck
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.uservalidity = response.data;
              if ($scope.uservalidity.length === 0) {
                  $scope.dispuserduplicate1 = "User Does Not Exists";
              }
              else {
                  $scope.dispuserduplicate1 = "";
              }
          });
      };
	  
    $scope.verifyemail = function (usercheck,email) {
        $http({
            method: 'GET'
            , url: 'api/emailduplicatecheck/' + usercheck +'/'+email
            , dataType: 'jsonp'
        }).then(function (response) {
            $scope.uservalidity = response.data;
            console.log($scope.uservalidity.length);
            if ($scope.uservalidity.length < 1) {
                 $scope.dispnoemail = "Username and Email ID Combination Does Not Exists";
                }
                else {
                  
                    $scope.dispnoemail = "";
                }
            
        });
    };
    
          $scope.submitForgetpwd = function () {
          $http({
              method: 'POST'
              , url: 'api/user/forgetpwd/'
              , data: $scope.user
              , headers: {
                  'Content-Type': 'application/json'
              }
          }).then(function (response) {
              console.log(String(response.data).substr(0,6));
              if (String(response.data).substr(0,6) == '250 ok') {
                  alert('Password has been sent to your registered Email ID.');
                 location.reload();
              }
          });
      };
	  
	  
	  $scope.ResetUUID = function () {
          $http({
              method: 'POST'
              , url: 'api/ResetUUID/'
              , data: $scope.userDetails
              , headers: {
                  'Content-Type': 'application/json'
              }
          }).then(function (response) {
             $scope.getUserData($scope.userDetails[0].id);
          });
      };
     
      $scope.GetUserDetails = function()
      {
         $scope.username = $window.localStorage["username"];
          $scope.username=$scope.username.replace(/\"/g,""); 
		  
           
		  
		  $scope.userid = $window.localStorage["userid"];
        $http({
              method: 'GET'
              , url: 'api/GetUserDetails/' + $scope.userid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.UserData = response.data;
          });  
      };
      
    //    RESET PASSWORD
     $scope.verifyOldpassword = function(){
         $scope.user.username=$window.localStorage["username"];
         $scope.newuser=$scope.user.username.replace(/\"/g,"");
		  $http({
				 method  : 'GET',
				 url     : 'api/userpasswdcheck/'+$scope.user.oldpassw+'/'+$scope.newuser,
				 data    : $scope.user,
				 headers : {'Content-Type': 'application/json'} 
			})
			.success(function(data) { 
			  if (data.length<1) {
				$scope.dispoldpwsswrng = "Incorrect Password";
				var element = $window.document.getElementById("oldpassw");
				if(element)
					{element.focus();}
				}
				else{$scope.dispoldpwsswrng="";}
			});
	};
    
    $scope.verifynewpassword = function(){
	
			
			 if($scope.user.newpassw.length<=8)
			 {
				 $scope.dispnewoldpasswrng1 = "Minimum Length 8";
				 var element = $window.document.getElementById("newpassw");
				 if(element)
					{element.focus();}
			 }
			 
			 else{$scope.dispnewoldpasswrng1="";}
			  if ($scope.user.newpassw === $scope.user.oldpassw) {
				$scope.dispnewoldpasswrng = "New password cannot be same as old password";
				var element = $window.document.getElementById("newpassw");
				if(element)
					{element.focus();}
				}
				else{$scope.dispnewoldpasswrng="";
				
				}
				
};

    $scope.verifypasswequal = function(){
				
			/* alert($scope.user.newpassw+" "+$scope.user.verifynewpassw); */
			  if ($scope.user.newpassw !== $scope.user.verifynewpassw) {
				$scope.dispnewpasswrng = "New and Confirm Passwords doesn’t match";
				var element = $window.document.getElementById("newpassw");
				if(element)
					{}
				}
				else{$scope.dispnewpasswrng="";}
};
    
    	$scope.submitpwdreset = function(){
		  $http({
				 method  : 'POST',
				 url     : 'api/updateresetpassw/',
				 data    : $scope.user,
				 headers : {'Content-Type': 'application/json'} 
			})
			.success(function(data) {
			  if (!data.success) {
				$scope.formMessage = data.message;
			  if($scope.formMessage==='Your Password has been changed...')
			  {
				  alert('Your Password has been changed...');
                  if(data)
                      {
                     $window.location.reload();
                      }
			  }
			  else{
				   alert('Sorry, something wrong...');
                    $window.location.reload();
              }
			  }
			  else{}
			});

};


      
	  
	   $scope.setPage = function (pageNo) {
			 $scope.currentPage = pageNo;
				};
			 $scope.filter = function () {
			 $timeout(function () {
			 $scope.filteredItems = $scope.userAttendanceList.length;
				}, 10);
			};
			$scope.sort = function (column) {
			if ($scope.orderProp === column) {
            $scope.direction = !$scope.direction;
			} else {
            $scope.orderProp = column;
            $scope.direction = false;
			}
		};
	
		
		
		
		/* ATTENDANCE */
			$scope.SendNotification = function()
			{
				$http({
              method: 'GET'
              , url: 'api/SendNotification/'
              , dataType: 'jsonp'
          }).then(function (response) {
              
		  });
			};
			
			
			$scope.CheckAttendanceStatus = function()
			{
				$http({
              method: 'GET'
              , url: 'api/getattendancestatus/'+$window.localStorage["userid"]
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.AttendanceStatus = response.data;
			  if($scope.AttendanceStatus[0] != undefined)
			  {
			  if($scope.AttendanceStatus[0].status == '1')
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
									url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + ","+ position.coords.longitude + "&sensor=true",
									dataType: 'jsonp'
								 }
							)
						  .then(function(response){
							  $scope.address=response.data.results[0].formatted_address;
						 
  
					   currentLocation = {
							userid : $window.localStorage["userid"],
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
			/* -------------- */
		
				socket.on('Locationrequest', function(userid){
						alert(userid)
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



					 $scope.InsertConnectedArea = function(lat,lan)
	  {
  if($scope.userlevel == "HO" || $scope.userlevel == "SUPERVISOR" || $scope.userlevel == "OFFICE")
  {
		   $http({
					method: 'GET',
					url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + ","+ lan + "&sensor=true",
				dataType: 'jsonp'
				}) .then(function(response){
				  $scope.address=response.data.results[0].formatted_address;
				  currentLocation = {
											createdby : $window.localStorage["userid"],
											lat : lat,
											lan : lan,
											address:$scope.address
									}; 
					$http({
							    method  : 'POST',
								url     : 'api/InsertConnectedArea/',
								data    : currentLocation,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						location.reload();
					});
				});
  }
	  }
	  
	  
	  $scope.GetCHatContent= function()
			{
				$http({
              method: 'GET'
              , url: 'api/GetCHatContent/'+$scope.userid
              , dataType: 'jsonp'
          }).then(function (response) {
				$scope.ChatContent = response.data;	
				alert(JSON.stringify($scope.ChatContent))
				 $( "#incomingMessages" ).html($scope.ChatContent);
		  });
				
			};
	 		
			// $( "#incomingMessages" ).html( $scope.chat );
$( "#SendButton" ).click( function() {
	$scope.username = $window.localStorage["username"];
			$scope.username=$scope.username.replace(/\"/g,""); 
			$scope.userid = $window.localStorage["userid"];
	var msg = $( "#messageText" ).val();
	if(msg == '')
	{
		$( "#messageText" ).focus();
	}
	else
	{
	var date = new Date();
	var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
	
	socket.emit( 'message', { message: msg,userid:$scope.userid,username:$scope.username,time:strTime } );
	return false;
	}
});




socket.on( 'message', function( data ) {
	$scope.username = $window.localStorage["username"];
			$scope.username=$scope.username.replace(/\"/g,""); 
			$scope.userid = $window.localStorage["userid"];
	var actualContent = $( "#incomingMessages" ).html();
	if(data.userid == $scope.userid)
	{
		var newMsgContent = '<div class="container1"> <div class="col-md-12 col-sm-12 col-xs-12" style="height:25px;"><b>You</b></div><div class="col-md-12 col-sm-12 col-xs-12"><p>' + data.message + '</p></div><span class="time-right">'+data.time+'</span></div>';
		
	}
	else
	{
		var newMsgContent = '<div class="container1 darker"> <div class="col-md-12 col-sm-12 col-xs-12" style="height:25px"><b>'+data.username+'</b></div><div class="col-md-12 col-sm-12 col-xs-12"><p>' + data.message + '</p></div><span class="time-right">'+data.time+'</span></div>';
		
	}
	var content = actualContent+newMsgContent;
	
	
	$( "#incomingMessages" ).html( content );
	$('#messageText').val('');
	var objDiv = document.getElementById("incomingMessages");
	objDiv.scrollTop = objDiv.scrollHeight;
});

			
			
   
});