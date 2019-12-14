  var MasterApp = angular.module('MasterApp', ['ui.bootstrap']).filter('startFrom', function () {
    return function (input, start) {
        start = +start;
         if(input!=undefined)
        {return input.slice(start);}
    }
}); 
  MasterApp.controller('masterController', function($scope,$http,$window) {
	  
			$scope.username = $window.localStorage["username"];
			$scope.username=$scope.username.replace(/\"/g,""); 
			$scope.userid = $window.localStorage["userid"];
			$scope.userlevel = $window.localStorage["Userlevel"];
			$scope.userlevel = $scope.userlevel.replace(/\"/g,""); 
			$scope.supervisor = $window.localStorage["supervisor"];
			$scope.cartlength = 0;
			$scope.notificationcount = 0;
			
			
			var socket = io();
			
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
		
		
		$scope.userlevelarray = ['HO','OFFICE','FIELD','SUPERVISOR','STOCK MANAGER','SALES EXICUTIVE','ACCOUNT HEAD','COLLECTION MAN','SHOP MANAGEMENT'];
		
			socket.on('LeaveEntry', function(leavedata){
							if($scope.userlevel == "HO")
							{
								if(leavedata != null)
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
							}
							else
								{
									$scope.LeavesList();
								}
					});
			
			/* ATTENDANCE */
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
									url: "https://maps.googleapis.com/maps//api/geocode/json?latlng=" + position.coords.latitude + ","+ position.coords.longitude + "&sensor=true",
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
			
			
			
			/* Working Shifts */
			
			$scope.ListShifts = function()
			{
				$http({
              method: 'GET'
              , url: 'api/ListShifts/'+$scope.userid+'/'+$scope.userlevel
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.shiftList = response.data;
			  
			  
			  $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.shiftList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagesShifts = function () {
					return Math.ceil($scope.shiftList.length / $scope.pageSize);
		  }
		  });
			};
			
			$scope.VendorList= function()
			{
				$http({
              method: 'GET'
              , url: 'api/VendorList/'
              , dataType: 'jsonp'
          }).then(function (response) {
				$scope.VendorListing = response.data;	
				
				 
		  });
				
			};
			
			$scope.getShiftData = function(id)
			{
				$http({
              method: 'GET'
              , url: 'api/getShiftData/'+id
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.shiftdata = response.data;
			  $scope.shiftdata[0].intime = new Date($scope.shiftdata[0].intime);
			  $scope.shiftdata[0].outtime = new Date($scope.shiftdata[0].outtime)
		  });
			};
			
			$scope.DeleteShiftData = function(shiftid)
				{
					var yes =confirm('Are You Sure ?')
					if(yes)
					{
			$http({
              method: 'DELETE'
              , url: 'api/DeleteShiftData/'+shiftid
              , dataType: 'jsonp'
          }).then(function (response) {
             alert(response.data.message);
			 $scope.ListShifts();
		  });
					}
		};
			
			
			$scope.SaveShiftdetails = function()
			{
				var indianTimeZoneVal = ($scope.shiftdata[0].intime).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj = new Date(indianTimeZoneVal);
					indainDateObj.setHours(indainDateObj.getHours() + 5);
					indainDateObj.setMinutes(indainDateObj.getMinutes() + 30);
					$scope.shiftdata[0].intime = indainDateObj;
					
					var indianTimeZoneVal1 = ($scope.shiftdata[0].outtime).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj1 = new Date(indianTimeZoneVal1);
					indainDateObj1.setHours(indainDateObj1.getHours() + 5);
					indainDateObj1.setMinutes(indainDateObj1.getMinutes() + 30);
					$scope.shiftdata[0].outtime = indainDateObj1;
				
				$http({
				 method  : 'POST',
				 url     : 'api/SaveShiftdetails/',
				 data    : $scope.shiftdata,
				 headers : {'Content-Type': 'application/json'} 
			})
			.success(function(data) {
				alert(data.message);
				$scope.ListShifts();
				$scope.shiftdata = [];
		  });
			};
			
			
			/* ----------------- */
			
			
			/* Rules */
			
			$scope.ListRules = function()
			{
				$http({
              method: 'GET'
              , url: 'api/ListRules/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.rulesList = response.data;
			  
			  
			  $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.rulesList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagesRules = function () {
					return Math.ceil($scope.rulesList.length / $scope.pageSize);
		  }
		  });
			};
			
			$scope.getRules = function(id)
			{
				$http({
              method: 'GET'
              , url: 'api/getRules/'+id
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.RulesData = response.data;
			  
		  });
			};
			
			$scope.DeleteRules = function(id)
				{
					var yes =confirm('Are You Sure ?')
					if(yes)
					{
			$http({
              method: 'DELETE'
              , url: 'api/DeleteRules/'+id
              , dataType: 'jsonp'
          }).then(function (response) {
             alert(response.data.message);
			 $scope.ListRules();
		  });
					}
		};
			
			
			$scope.SaveRules = function()
			{
				
					$scope.RulesData[0].createdby = $scope.userid;
				
				$http({
				 method  : 'POST',
				 url     : 'api/SaveRules/',
				 data    : $scope.RulesData,
				 headers : {'Content-Type': 'application/json'} 
			})
			.success(function(data) {
				alert(data.message);
				$scope.ListRules();
				$scope.RulesData = [];
		  });
			};
			
			
			/* ----------------- */
			
			
			
			/* Vendor Payments */
			
			$scope.ListVendorpayment = function()
			{
				$http({
              method: 'GET'
              , url: 'api/ListVendorpayment/'+$scope.userid+'/'+$scope.userlevel
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.vendorpaymentList = response.data;
			  
			  
			  $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.vendorpaymentList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagesPayments = function () {
					return Math.ceil($scope.vendorpaymentList.length / $scope.pageSize);
		  }
		  });
			};
			
			$scope.getVendorpayment = function(id)
			{
				$http({
              method: 'GET'
              , url: 'api/getVendorpayment/'+id
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.paymentData = response.data;
			  $scope.paymentData[0].paymentdate = new Date($scope.paymentData[0].paymentdate);
		  });
			};
			
			$scope.DeleteVendorpayment = function(shiftid)
				{
					var yes =confirm('Are You Sure ?')
					if(yes)
					{
			$http({
              method: 'DELETE'
              , url: 'api/DeleteVendorpayment/'+shiftid
              , dataType: 'jsonp'
          }).then(function (response) {
             alert(response.data.message);
			 $scope.ListVendorpayment();
		  });
					}
		};
			
			
			$scope.SaveVendorPayments = function()
			{
				var indianTimeZoneVal = ($scope.paymentData[0].paymentdate).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj = new Date(indianTimeZoneVal);
					indainDateObj.setHours(indainDateObj.getHours() + 5);
					indainDateObj.setMinutes(indainDateObj.getMinutes() + 30);
					$scope.paymentData[0].paymentdate = indainDateObj;
					$scope.paymentData[0].createdby = $scope.userid;
				
				$http({
				 method  : 'POST',
				 url     : 'api/SaveVendorPayments/',
				 data    : $scope.paymentData,
				 headers : {'Content-Type': 'application/json'} 
			})
			.success(function(data) {
				alert(data.message);
				$scope.ListVendorpayment();
				$scope.paymentData = [];
		  });
			};
			
			
			/* ----------------- */
			
			
			
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
			  console.log($scope.userList)
          });
		  
      };
			
			$scope.SelectedUsers = [];
			$scope.syncusersALL = function(bool, item){
	  console.log(item);
    if(bool){
      // add item
		$scope.SelectedUsers.push(item);
	
    } else {
      // remove item
      for(var i=0 ; i < $scope.SelectedUsers.length; i++) {
        if($scope.SelectedUsers[i].id == item.id){
          $scope.SelectedUsers.splice(i,1);
        }
      }         
    }
	console.log($scope.SelectedUsers);
  };
			
  $scope.syncusers = function(bool, item){
    if(bool){
      // add item
		$scope.SelectedUsers.push(item);
	  
    } else {
      // remove item
      for(var i=0 ; i < $scope.SelectedUsers.length; i++) {
        if($scope.SelectedUsers[i].id == item.id){
          $scope.SelectedUsers.splice(i,1);
        }
      }         
    }
	console.log($scope.SelectedUsers);
  };
			
			
			$scope.beatuserid = 0;
			$scope.beatarea = [{week1:'',week2:''}];
			
			for(var i = 0 ; i < 6;i++)
			{
				$scope.beatarea.push({week1:'',week2:''});
			}
			
			/* BEAT */
			
			$scope.Listbeat = function()
			{
				$http({
              method: 'GET'
              , url: 'api/Listbeat/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.BeatList = response.data;
			  console.log($scope.BeatList);
					$scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.BeatList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagesbeat = function () {
					return Math.ceil($scope.BeatList.length / $scope.pageSize);
    };
			  
		  });
			};
			
			 $scope.setPage = function (pageNo) {
			 $scope.currentPage = pageNo;
				};
			 $scope.filter = function () {
			 $timeout(function () {
			 $scope.filteredItems = $scope.StateList.length;
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
			
			$scope.getBeatDetails = function(beatid)
			{
				$http({
              method: 'GET'
              , url: 'api/getBeatDetails/'+beatid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.beatDetails = response.data;
		  });
			};
			
			$scope.deleteBeatDetails= function(beatid)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/deleteBeatDetails/'+beatid
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						$scope.Listbeat();
		  });
				}
				else
				{}
			};
			
			
			$scope.AddNewBeat= function() {
				$scope.beatarea[0].beatname = $scope.beat.beatname;
				$scope.beatarea[0].beatuserid = $scope.beatuserid;
				console.log($scope.beatarea);
					$http({
							    method  : 'POST',
								url     : 'api/AddNewBeat/',
								data    : $scope.beatarea,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						location.reload();
					});
				};
				
				$scope.EditBeat= function() {
				console.log($scope.beatDetails);
					$http({
							    method  : 'POST',
								url     : 'api/EdiBeatDetails/',
								data    : $scope.beatDetails,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						location.reload();
					});
				};

			
			
			/* BEAT */
			
			
			
			/* STATE */
			
			$scope.ListState = function()
			{
				$http({
              method: 'GET'
              , url: 'api/ListState/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.StateList = response.data;
			  
					$scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.StateList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.StateList.length / $scope.pageSize);
    };
			  
		  });
			};
			
			 $scope.setPage = function (pageNo) {
			 $scope.currentPage = pageNo;
				};
			 $scope.filter = function () {
			 $timeout(function () {
			 $scope.filteredItems = $scope.StateList.length;
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
			
			$scope.getStateData = function(stateid)
			{
				$http({
              method: 'GET'
              , url: 'api/GetState/'+stateid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.StateDetails = response.data;
		  });
			};
			
			$scope.DeleteState= function(stateid)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/DeleteState/'+stateid
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						$scope.ListState();
		  });
				}
				else
				{}
			};
			
			  $scope.addState= function() {
					$http({
							    method  : 'POST',
								url     : 'api/addState/',
								data    : $scope.state,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.state = null;
						$scope.ListState();
					});
				};

				$scope.editState= function() {
					$http({
							    method  : 'POST',
								url     : 'api/editState/',
								data    : $scope.StateDetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.ListState();
					});
				};
				
				
				/* CITY */
				
				$scope.ListCity = function()
			{
				$http({
              method: 'GET'
              , url: 'api/ListCity/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.CityList = response.data;
			  
				$scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.CityList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.CityList.length / $scope.pageSize);
		};
			  
		  });
			};
			
			 $scope.setPage = function (pageNo) {
			 $scope.currentPage = pageNo;
				};
			 $scope.filter = function () {
			 $timeout(function () {
			 $scope.filteredItems = $scope.CityList.length;
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
			
			$scope.getCityData = function(cityid)
			{
				$http({
              method: 'GET'
              , url: 'api/GetCity/'+cityid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.CityDetails = response.data;
		  });
			};
			
			$scope.DeleteCity= function(cityid)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/DeleteCity/'+cityid
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						$scope.ListCity();
		  });
				}
				else
				{}
			};
			
			  $scope.addCity= function() {
					$http({
							    method  : 'POST',
								url     : 'api/addCity/',
								data    : $scope.city,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.city = null;
						$scope.ListCity();
						$scope.ListState();
					});
				};

				$scope.editCity= function() {
					$http({
							    method  : 'POST',
								url     : 'api/editCity/',
								data    : $scope.CityDetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.ListCity();
						$scope.ListState();
					});
				};
				
				/*REGION*/
				
				$scope.ListRegion = function()
			{
				$http({
              method: 'GET'
              , url: 'api/ListRegion/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.RegionList = response.data;
			  
			  $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.RegionList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.RegionList.length / $scope.pageSize);
		};
			  
		  });
			};
			
			$scope.setPage = function (pageNo) {
			 $scope.currentPage = pageNo;
				};
			 $scope.filter = function () {
			 $timeout(function () {
			 $scope.filteredItems = $scope.RegionList.length;
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
			
			$scope.getRegionData = function(regionid)
			{
				$http({
              method: 'GET'
              , url: 'api/GetRegion/'+regionid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.RegionDetails= response.data;
		  });
			};
			
			$scope.DeleteRegion= function(regionid)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/DeleteRegion/'+regionid
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						$scope.ListRegion();
		  });
				}
				else
				{}
			};
			
			  $scope.addRegion= function() {
					$http({
							    method  : 'POST',
								url     : 'api/addRegion/',
								data    : $scope.region,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.region = null;
						$scope.ListRegion();
						$scope.ListCity();
					});
				};

				$scope.editRegion= function() {
					$http({
							    method  : 'POST',
								url     : 'api/editRegion/',
								data    : $scope.RegionDetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.ListRegion();
						$scope.ListCity();
					});
				};
				
				/* AREA */
				
				$scope.ListArea= function()
			{
				$http({
              method: 'GET'
              , url: 'api/AreaList/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.AreaList= response.data;
			  
			  $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.AreaList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.AreaList.length / $scope.pageSize);
		};
		
		  });
			};
			
			$scope.setPage = function (pageNo) {
			 $scope.currentPage = pageNo;
				};
			 $scope.filter = function () {
			 $timeout(function () {
			 $scope.filteredItems = $scope.AreaList.length;
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
			
			$scope.getAreaData= function(areaid)
			{
				$http({
              method: 'GET'
              , url: 'api/getAreaData/'+areaid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.AreaDetails= response.data;
		  });
			};
			
			$scope.DeleteArea= function(cityid)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/DeleteArea/'+cityid
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						$scope.ListArea();
		  });
				}
				else
				{}
			};
			
			  $scope.addArea= function() {
					$http({
							    method  : 'POST',
								url     : 'api/addArea/',
								data    : $scope.area,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.area= null;
						$scope.ListArea();
					});
				};

				$scope.editArea= function() {
					$http({
							    method  : 'POST',
								url     : 'api/editArea/',
								data    : $scope.AreaDetails,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.ListArea();
						$scope.ListRegion();
					});
				};
				
				
				/* TRAGET V/S ACHIEVEMENTS */
				
				$scope.ListTarget= function()
			{
				$http({
              method: 'GET'
              , url: 'api/TargetList/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.TargetList= response.data;
			  
			  $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.TargetList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.TargetList.length / $scope.pageSize);
		};
		
		  });
			};
			
			$scope.setPage = function (pageNo) {
			 $scope.currentPage = pageNo;
				};
			 $scope.filter = function () {
			 $timeout(function () {
			 $scope.filteredItems = $scope.TargetList.length;
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
			
			$scope.getTargetData= function(targetid)
			{
				$http({
              method: 'GET'
              , url: 'api/getTargetData/'+targetid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.targetdetails= response.data;
			  console.log($scope.targetdetails);
              $scope.targetdetails[0].startdate = new Date($scope.targetdetails[0].startdate);
              $scope.targetdetails[0].enddate = new Date($scope.targetdetails[0].enddate);
			  console.log($scope.targetdetails);
		  });
			};
			
			$scope.syncedit = function(bool, item,targetass){
				console.log(bool);
				
    if(bool == undefined){
					console.log(item);
					console.log(targetass);
	}
		if(bool){
      // add item		
		$scope.targetdetails.push({'userid':item.id,'targetid':$scope.targetdetails[0].masterid,'assignid':$scope.targetdetails[0].targetassignedid});
	console.log($scope.targetdetails);
    } else {
      // remove item
      for(var i=0 ; i < $scope.targetdetails.length; i++) {
        if($scope.targetdetails[i].id == item.id){
          $scope.targetdetails.splice(i,1);
        }
      } 
		console.log($scope.targetdetails);	  
    }
  };
 
	
         
	  $scope.isCheckededit = function(users){
		
      var match = false;
      for(var i=0 ; i < $scope.targetdetails.length; i++) {
		
					if($scope.targetdetails[i].id == users.id){
						
					  match = true;
					}
		  
      }
      return match;
  };
			
			
			$scope.DeleteTarget= function(targetid)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/DeleteTarget/'+targetid
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						$scope.ListTarget();
		  });
				}
				else
				{}
			};
			
			  $scope.addTarget= function() {
				  if($scope.target.startdate)
				  {
					  var dd = $scope.target.startdate.getDate();
					   if(dd < 10)
						   dd = '0'+dd;
					  var mm = $scope.target.startdate.getMonth() +1;
					  if(mm <10)
						  mm = '0'+mm;
					  var yy = $scope.target.startdate.getFullYear();
					  
					  var startdate = yy+'-'+mm+'-'+dd;
					  
				  }
				  if($scope.target.enddate)
				  {
					  var dd = $scope.target.enddate.getDate();
					   if(dd < 10)
						   dd = '0'+dd;
					  var mm = $scope.target.enddate.getMonth() +1;
					  if(mm <10)
						  mm = '0'+mm;
					  var yy = $scope.target.enddate.getFullYear();
					  
					   var enddate = yy+'-'+mm+'-'+dd;
				  }
					  $scope.SelectedUsers[0].createdby = $scope.userid;
					  $scope.SelectedUsers[0].targetname = $scope.target.name;
					  $scope.SelectedUsers[0].description = $scope.target.description;
					  $scope.SelectedUsers[0].startdate = startdate;
					  $scope.SelectedUsers[0].enddate = enddate;
					  $scope.SelectedUsers[0].targetcount = $scope.target.targetcount;
				$scope.SelectedUsers[0].targetincmpltamt = $scope.target.targetincmpltamt;
					  $scope.SelectedUsers[0].targetcompletedamt = $scope.target.targetcompletedamt;
				  
					$http({
							    method  : 'POST',
								url     : 'api/addTarget/',
								data    : $scope.SelectedUsers,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.target= null;
						$scope.ListTarget();
					});
				};

				$scope.Edittarget= function() {
					if($scope.targetdetails[0].startdate)
				  {
					  var dd = $scope.targetdetails[0].startdate.getDate();
					   if(dd < 10)
						   dd = '0'+dd;
					  var mm = $scope.targetdetails[0].startdate.getMonth() +1;
					  if(mm <10)
						  mm = '0'+mm;
					  var yy = $scope.targetdetails[0].startdate.getFullYear();
					  
					  $scope.targetdetails[0].startdate = yy+'-'+mm+'-'+dd;
					  
				  }
				  if($scope.targetdetails[0].enddate)
				  {
					  var dd = $scope.targetdetails[0].enddate.getDate();
					   if(dd < 10)
						   dd = '0'+dd;
					  var mm = $scope.targetdetails[0].enddate.getMonth() +1;
					  if(mm <10)
						  mm = '0'+mm;
					  var yy = $scope.targetdetails[0].enddate.getFullYear();
					  
					   $scope.targetdetails[0].enddate = yy+'-'+mm+'-'+dd;
				  }
					$http({
							    method  : 'POST',
								url     : 'api/EditTarget/',
								data    : $scope.targetdetails,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.ListTarget();
					});
				};
				
				
				
				$scope.region = {};
				
				/* Connections */
				$scope.getStateOnCity = function(cityid)
			{
				$http({
              method: 'GET'
              , url: 'api/getStateOnCity/'+cityid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.StateDetailsOnCity = response.data;
			  if($scope.region != null)
			  {
              $scope.region.statename= $scope.StateDetailsOnCity [0].statename;
              $scope.region.state= $scope.StateDetailsOnCity [0].state;
			  }
			  else
			  {
              $scope.RegionDetails[0].statename= $scope.StateDetailsOnCity [0].statename;
              $scope.RegionDetails[0].state= $scope.StateDetailsOnCity [0].state;
			  }
		  });
			};
			
			$scope.getAreaOnRegion = function(regionid)
			{
				$http({
              method: 'GET'
              , url: 'api/getAreaOnRegion/'+regionid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.areaDetailsOnRegion = response.data;
              console.log($scope.areaDetailsOnRegion);
		  });
			};
			
			/* CHATTING */
			
		
	

function trigger_notification(message)
    {
		console.log(message);
        if("Notification" in window)
        {
            if(Notification.permission == "granted")
            {
                var notification = new Notification(message, {"body":"SFA", "icon":"http://qnimate.com/wp-content/uploads/2014/07/web-notification-http://119.81.18.187:8003/api-300x150.jpg"});
            }
            else
            {
                Notification.requestPermission(function (permission) {
                if (permission === "granted") 
					{
						var notification = new Notification(message, {"body":"SFA", "icon":"http://qnimate.com/wp-content/uploads/2014/07/web-notification-http://119.81.18.187:8003/api-300x150.jpg"});
					}
				});
            }
			document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="images/alarm.mp3" type="audio/mpeg" /><embed hidden="true" autostart="true" loop="false" src="images/alarm.mp3" /></audio>';
        }   
        else
        {
            alert("Your browser doesn't support notfication http://119.81.18.187:8003/api");
        }       
    }
			
	
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
			
			/* ADVERTISMENT */
			
			
			$scope.ListAdvertsiment= function()
			{
				$http({
              method: 'GET'
              , url: 'api/ListAdvertsiment/'+$scope.userlevel+'/'+$scope.userid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.AdvertismentList= response.data;
			  
			  $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.AdvertismentList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagesadv = function () {
					return Math.ceil($scope.AdvertismentList.length / $scope.pageSize);
		};
		$scope.GetAdvertisement = function(index)
		{
			$scope.Advertisement = [];
			$scope.Advertisement.push($scope.AdvertismentList[index]);
			console.log($scope.Advertisement)
		};
		
		
		
		  });
			};
			
			function SaveSender(senderid)
			{
				$http({
							    method  : 'POST',
								url     : 'api/savesenderid/',
								data    : {senderid:senderid,advid:$scope.Advertisement[0].id},
								headers : {'Content-Type': 'application/json'} 
									})
									.success(function(data) {
									});
			}
			
			$scope.DeleteAdvertsiment= function(advdata) {
				var yes = confirm('With This Action Record Will Paramanently Deleted From System. Want To Delete It?')
				if(yes)
				{
					$http({
							    method  : 'POST',
								url     : 'api/DeleteAdvertsiment/',
								data    : advdata,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.ListAdvertsiment();
					});
				}
				};
				
				$scope.verifycnts = true;
				$scope.sendmsg = false;
				$scope.Clientsdata = [];
				$scope.SendAdvertisement = function(clientdata)
				{
					$scope.Clientsdata = clientdata;
						$scope.verifycnts = false;
						$scope.sendmsg = true;
					$scope.$apply();
				};
				
				$scope.SendMessage = function()
				{
					var $this = $("#load");
					$this.button('loading');
				  
							for(var i = 0 ; i < $scope.Clientsdata.length;i++)
							{
								
								var j = i;
							$http({
							    method  : 'POST',
								url     : 'api/SendAdvertisement/',
								data    : {adv:$scope.Advertisement,clients:$scope.Clientsdata[i],SENDERID:$scope.senderid},
								headers : {'Content-Type': 'application/json'} 
							})
							.success(function(data) {								
								if(j == $scope.Clientsdata.length - 1)
								{
									alert(data.message);
								
								$scope.smsStatus = data.file
								
								 myVar = setTimeout(function(){ 
								 
								 document.getElementById('reportDownload').click();
									
								 clearTimeout(myVar);
								  
								 }, 1500);

								  myVar1 = setTimeout(function(){ 
								 
								 clearTimeout(myVar1);
								  location.reload();
								 }, 2000); 
								}
							});
							
							
								
							}
							
							
								
							
							
				};
				
				$scope.AddNewNumber = function(index)
				{
					$scope.Clientsdata.push({});
				}
				
				$scope.RemoveNumber = function(index)
				{
					$scope.Clientsdata.splice(index,1);
				}
				
				//$scope.SendAdvertisement= function(advdata) {
					
					//$scope.smssenderhosts = [{name:'http://promdnd.wwis.co.in',value:'promdnd'},{name:'http://transms.wwis.co.in',value:'transms'},{name:'http://103.16.101.52/bulksms',value:'bulksms'}]
					
					
					$scope.smssenderhosts = [{name:'Threesa SMS getway',value:'http://sms.threesainfoway.net/app/smsapi/index.php?key=25C65576831AFC&routeid=415&type=text'}]
					
					$scope.SendAdvertisement_Old = function(clientsdata) {
						var count = 0;
						var mobnos = '';
						for(var i = 0 ; i < clientsdata.length;i++)
						{
							 mobnos = mobnos+clientsdata[i].DTDS0+','; 
							
						}
						mobnos = mobnos.substr(0, mobnos.length - 1); 
						
						if($scope.Advertisement[0].shortenurl === null)
						{
						
				var requrl = 'https://api-ssl.bitly.com/v3/shorten?access_token=11f61c5a26c4387e83194545efac7cbc7b0ac686&longUrl=http://office.threesainfoway.net:8897/advfiles/'+$scope.Advertisement[0].advfile;
				
								
				$http({
              method: 'GET'
              , url: requrl
								
              , dataType: 'jsonp'
          }).then(function (response) {
			  
			  var sendinglink = response.data.data.url;
			  
			  var bulksms ='http://103.16.101.52/bulksms/bulksms?username=fggf-threesa&password=log2spac&type=0&dlr=1&destination='+mobnos+'&source='+$scope.senderid+'&message='+$scope.Advertisement[0].description.split(' ').join('%20')+'%20Click%20the%20link%20:%20'+sendinglink+''
			  
			  var transms = 'http://transms.wwis.co.in/api/sendmsg.php?user=threesa&pass=threesa123&sender='+$scope.senderid+'&phone='+mobnos+'&text='+$scope.Advertisement[0].description.split(' ').join('%20')+'%20Click%20the%20link%20:%20'+sendinglink+'&priority=ndnd&stype=normal';
			  
			  var promdnd = 'http://promdnd.wwis.co.in/api/sendmsg.php?user=threesadnd&pass=SArthak@3&sender='+$scope.senderid+'&phone='+mobnos+'&text='+$scope.Advertisement[0].description.split(' ').join('%20')+'%20Click%20the%20link%20:%20'+sendinglink+'&priority=ndnd&stype=normal'
			  
			  if($scope.senderhost === 'bulksms')
			  {var sendlink = bulksms;}
			  if($scope.senderhost === 'transms')
			  {var sendlink = transms;}
			  if($scope.senderhost === 'promdnd')
			  {
				  var sendlink = promdnd;
			  }
			  else
			  {
				   var sendlink = $scope.senderhost+"&contacts="+mobnos+"&senderid="+$scope.senderid+"&msg="+$scope.Advertisement[0].description.split(' ').join('%20')+"%20Click%20the%20link%20:%20"+sendinglink;
			  }
			  
			  
			  //SaveSender($scope.senderid);
			  
			  var msgDetails = {
					key:'25C65576831AFC',
					routeid:'415',
					type:'text',
					contacts:mobnos,
					senderid:$scope.senderid,
					msg:$scope.Advertisement[0].description+'\n Click the link :'+sendinglink
				}

								 $http({
												method  : 'POST',
												url     : 'http://sms.threesainfoway.net/app/smsapi/index.php?key=25C65576831AFC&routeid=415&type=text&contacts='+mobnos+'&senderid='+$scope.senderid+'&msg='+$scope.Advertisement[0].description+'\n Click the link='+$scope.Advertisement[0].shortenurl,
												data    : {
														msg:$scope.Advertisement[0].description+'\n Click the link :'+$scope.Advertisement[0].shortenurl
													},
												headers : {'Content-Type': 'application/json',"Access-Control-Expose-Headers":"Access-Control-*","Access-Control-Allow-Headers":"Access-Control-*, Origin, X-Requested-With, Content-Type, Accept",'Access-Control-Allow-Origin': '*'} 
									})
									.success(function(data) {
										console.log(data);
									}); 
			  
			 
			 
			 
			 /* 	var fd = new FormData();
         /* fd.append('key','25C65576831AFC');
         fd.append('routeid',415);
         fd.append('type', 'text'); //
        fd.append('contacts', String(mobnos));
        fd.append('senderid', $scope.senderid);
        fd.append('msg', $scope.Advertisement[0].description+'\n Click the link :'+sendinglink);
        $http.post('http://sms.threesainfoway.net/app/smsapi/index.php?key=25C65576831AFC&routeid=415&type=text', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined,"Access-Control-Expose-Headers":"Access-Control-*","Access-Control-Allow-Headers":"Access-Control-*, Origin, X-Requested-With, Content-Type, Accept",'Access-Control-Allow-Origin': '*'}
        })
        .success(function(){
			console.log('success');
        })
        .error(function(){
			console.log('error');
        });
			  */
			  
			  
			  //window.open(sendlink, '_blank');
			  
			  
		  });
						}
						else
						{
							  var bulksms ='http://103.16.101.52/bulksms/bulksms?username=fggf-threesa&password=log2spac&type=0&dlr=1&destination='+mobnos+'&source='+$scope.senderid+'&message='+$scope.Advertisement[0].description.split(' ').join('%20')+'%20Click%20the%20link%20:%20'+$scope.Advertisement[0].shortenurl+''
			  
							  var transms = 'http://transms.wwis.co.in/api/sendmsg.php?user=threesa&pass=threesa123&sender='+$scope.senderid+'&phone='+mobnos+'&text='+$scope.Advertisement[0].description.split(' ').join('%20')+'%20Click%20the%20link%20:%20'+$scope.Advertisement[0].shortenurl+'&priority=ndnd&stype=normal'
							  

							  var promdnd = 'http://promdnd.wwis.co.in/api/sendmsg.php?user=threesadnd&pass=SArthak@3&sender='+$scope.senderid+'&phone='+mobnos+'&text='+$scope.Advertisement[0].description.split(' ').join('%20')+'%20Click%20the%20link%20:%20'+$scope.Advertisement[0].shortenurl+'&priority=ndnd&stype=normal'
							  
									if($scope.senderhost === 'bulksms')
								  {var sendlink = bulksms;}
								  if($scope.senderhost === 'transms')
								  {var sendlink = transms;}
								  if($scope.senderhost === 'promdnd')
								  {
									  var sendlink = promdnd;
								  }
								  else
										  {
											   var sendlink = $scope.senderhost+"&contacts="+mobnos+"&senderid="+$scope.senderid+"&msg="+$scope.Advertisement[0].description.split(' ').join('%20')+"%20Click%20the%20link%20:%20"+$scope.Advertisement[0].shortenurl;
										  }
			  
										//SaveSender($scope.senderid);
										
										
										
								  //window.open(sendlink, '_blank');
								  
			

								 $http({
												method  : 'POST',
												url     : 'http://sms.threesainfoway.net/app/smsapi/index.php?key=25C65576831AFC&routeid=415&type=text&contacts='+mobnos+'&senderid='+$scope.senderid+'&msg='+$scope.Advertisement[0].description+'\n Click the link='+$scope.Advertisement[0].shortenurl,
												data    : {
														msg:$scope.Advertisement[0].description+'\n Click the link :'+$scope.Advertisement[0].shortenurl
													},
												headers : {'Content-Type': 'application/json',"Access-Control-Expose-Headers":"Access-Control-*","Access-Control-Allow-Headers":"Access-Control-*, Origin, X-Requested-With, Content-Type, Accept",'Access-Control-Allow-Origin': '*'} 
									})
									.success(function(data) {
										console.log(data);
									}); 
									
									
									
									/* var fd = new FormData();
         /* fd.append('key','25C65576831AFC');
         fd.append('routeid',415);
         fd.append('type', 'text'); //
        fd.append('contacts', String(mobnos));
        fd.append('senderid', $scope.senderid);
        fd.append('msg', $scope.Advertisement[0].description+'\n Click the link :'+$scope.Advertisement[0].shortenurl);
        $http.post('http://sms.threesainfoway.net/app/smsapi/index.php?key=25C65576831AFC&routeid=415&type=text', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined,"Access-Control-Expose-Headers":"Access-Control-*","Access-Control-Allow-Headers":"Access-Control-*, Origin, X-Requested-With, Content-Type, Accept",'Access-Control-Allow-Origin': '*'}
        })
        .success(function(response){
			console.log(response);
        })
        .error(function(error){
			console.log(error);
        });
			  */
									
									
									
						}
								
								/* 
								
								$http({
							    method  : 'POST',
								url     : 'https://www.googleapis.com/urlshortener/v1/url?fields=longUrl&key=AIzaSyDqxgUEhObJ7TaJQ3GgTDNhsmsc0hk39-0',
								data    : {"longUrl": 'http://office.threesainfoway.net:8897/advfiles/'+$scope.Advertisement[0].advfile},
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						console.log(data)
					}); 
								 */
								
						/* 	var smsurl ='http://103.16.101.52/bulksms/bulksms?username=fggf-threesa&password=log2spac&type=0&dlr=1&destination='+mobnos+'&source=THRESA&message='+$scope.Advertisement[0].description.split(' ').join('%20')+'%20Click%20the%20link%20:%20http://office.threesainfoway.net:8897/advfiles/'+$scope.Advertisement[0].advfile+''
								 */
								
								
										
								//
						
						 //mobnos = mobnos.substr(0, mobnos.length - 1); 
							/* console.log(mobnos); */
						//var smsurl = 'http://transms.wwis.co.in/api/sendmsg.php?user=threesa&pass=threesa123&sender=THREESA&phone='+mobnos+'&text='+advdata.description.split(' ').join('%20')+'Click%20The%20link%20:%20http://103.252.7.5:8897/advfiles/'+advdata.advfile+'&priority=dnd&stype=normal'; 
								
								
							/*  var smsurl = 	'http://103.16.101.52/bulksms/bulksms?username=fggf-threesa&password=log2spac&type=0&dlr=1&destination='+clientsdata[i].DTDS0+'&source=THRESA&message='+advdata.description+'Click The link bellow \n http://103.252.7.5:8897/advfiles/'+advdata.advfile+'' */
								
								//console.log(smsurl);
							/*  $http({
							    method  : 'GET',
								url: smsurl 
							, dataType: 'jsonp',
							headers : {'Content-Type': 'application/json'}
								}).then(function (response) {
									
												alert('OK')
										
								}); */
						 
						
						
						
						
						
					/* 
					'https://smsapi.engineeringtgr.com/send/?Mobile=9768241151&Password=Mayur975&Message=http://103.252.7.5:8897/advfiles/'+advdata.advfile+'&To='+clientsdata[i].DTDS0+'&Key=mhatrECOsqg0iZbK5tcUunkxAYPRV8'
					
					$http({
							    method  : 'POST',
								url     : 'api/SendAdvertisement/',
								data    : advdata,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.ListAdvertsiment();
					}); */
					};
				
				
			
			
			
			
			
});