  var ProductApp = angular.module('ProductApp', []).filter('startFrom', function () {
    return function (input, start) {
        start = +start;
       if(input!=undefined)
        {return input.slice(start);}
    }
}); 
  ProductApp.controller('productController', function($scope,$http,$window,$rootScope,$filter) {
	  
	  var socket = io();
	  
	  
	  
	  
	/*   var sipsocket = new JsSIP.WebSocketInterface('wss://sip.threesainfoway.net:8089');
var configuration = {
  sockets  : [ sipsocket ],
  uri      : 'sip:319@sip.threesainfoway.net',
  password : 'admin@123'
};
 
var ua = new JsSIP.UA(configuration);
 
ua.start(); */
	
			$scope.username = $window.localStorage["username"];
			$scope.username=$scope.username.replace(/\"/g,""); 
			$scope.userid = $window.localStorage["userid"];
			$scope.userlevel = $window.localStorage["Userlevel"];
			$scope.userlevel = $scope.userlevel.replace(/\"/g,""); 
			$scope.supervisor = $window.localStorage["supervisor"];
			
			$scope.cartlength = 0;
			$scope.notificationcount = 0;
			
			$scope.getDashboardValues = function()
			{
				$http({
              method: 'GET'
              , url: 'api/getDashboardValues/'+$scope.userlevel+'/'+$scope.userid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.getDashboardValuescounts = response.data;
		  });
			};
			
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
			  console.log($scope.LeavesNotification)
		  });
		};
			
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
			
			$scope.setMyAttendance = function()
			{
				navigator.geolocation.getCurrentPosition(showPosition);
				function showPosition(position) {
						  
						  
					/* "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAZsLcN73I6r8GvqDBG5-713o-kftemVcU&latlng=" + position.coords.latitude + ","+ position.coords.longitude + "&sensor=true&key=AIzaSyCVKZcPrJtNPHaqFdcFSBHosUp_Cip8rqk" */	
						  
						var url =  "https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=" + position.coords.latitude + ","+ position.coords.longitude + "&mode=retrieveAddresses&maxresults=1&gen=9&app_id=F2DrM7GiRxDODD2SR10H&app_code=KA7GSs5492GnQ5Xxzq791Q"
						  
						  
						  $http(
								{
									method: 'GET',
									url: url,
									dataType: 'jsonp'
								 }
							)
						  .then(function(response){
							 /*  console.log(response.data.Response.View[0].Result[0].Location.Address)
							  console.log('---------------------') */
							  var formatedaddress = response.data.Response.View[0].Result[0].Location.Address.Label+","+response.data.Response.View[0].Result[0].Location.Address.PostalCode;
							  
							  
							if(response.data.Response.View[0])
							  $scope.address = formatedaddress;
						  else
						  $scope.address= "google error custome address "
  
					   currentLocation = {
							userid : $window.localStorage["userid"],
							address:$scope.address,
							lat:position.coords.latitude,
							lan:position.coords.longitude,
						}; 
				$http({
				 method  : 'POST',
				 url     : 'api/userAttendance/',
				 data    : currentLocation,
				 headers : {'Content-Type': 'application/json'} 
			})
			.success(function(data) {
				console.log(data);
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
			  
					$scope.currentPage = 0;
					$scope.pageSize = 7;
					if($scope.myValue > $scope.userList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagesUserprofile = function () {
					return Math.ceil($scope.userList.length / $scope.pageSize);
		};
			  
			  $scope.getAllUserDetails = function(userid)
			{
				
				  $http({
              method: 'GET'
              , url: 'api/GetUserDetails/' + userid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.AlluserDetails = response.data;
          });  
			}
			
          });
			};
			
			
			$scope.getSosreport = function()
			{
				/* $http({
              method: 'GET'
              , url: 'api/getSoreport/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.SosReport = response.data; */
				var chart = AmCharts.makeChart( "chartdiv", {
  "type": "serial",
  "theme": "light",
  "dataProvider": [ {
    "name": "SO1",
    "amount":25400
  }, {
    "name": "SO2",
    "amount":20400
  }, {
    "name": "SO3",
    "amount":12000
  }, {
    "name": "SO4",
    "amount":60000
  }, {
    "name": "SO5",
    "amount":20000
  }, {
    "name": "SO6",
    "amount":120000
  }],
  "valueAxes": [ {
    "gridColor": "#FFFFFF",
    "gridAlpha": 0.2,
    "dashLength": 0
  } ],
  "gridAboveGraphs": true,
  "startDuration": 1,
  "graphs": [ {
    "balloonText": "[[category]]: <b>[[value]]</b>",
    "fillAlphas": 0.8,
    "lineAlpha": 0.2,
    "type": "column",
    "valueField": "amount"
  } ],
  "chartCursor": {
    "categoryBalloonEnabled": false,
    "cursorAlpha": 0,
    "zoomable": false
  },
  "categoryField": "name",
  "categoryAxis": {
    "gridPosition": "start",
    "gridAlpha": 0,
    "tickPosition": "start",
    "tickLength": 20
  }

} );
			/* }); */
			};
			
			
		
			  
			 
	
			$scope.getperticulerUserAttendance = function(month,userid)
			{
				if(month == undefined)
				{var curmonth = new Date();
				var mm = curmonth.getMonth()+1;
				if(mm < 10)
					{mm ='0'+mm}

					var yy = curmonth.getFullYear();
				}
				else
				{
				var mm = month.getMonth()+1;
					if(mm < 10)
						{mm ='0'+mm}
						
						var yy = month.getFullYear();
				}
				
						var passedmonth =  mm+'-'+yy
						
console.log(passedmonth)
				$http({
              method: 'GET'
              , url: 'api/getperticulerUserAttendance/'+passedmonth+'/'+userid
              , dataType: 'jsonp'
			}).then(function (response) {
              $scope.userAttendaceListingDashboard = response.data;
			  console.log( $scope.userAttendaceListingDashboard);
			   $scope.currentPage = 0;
					$scope.pageSize = 5;
					if($scope.myValue > $scope.userAttendaceListingDashboard.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagesForAttendance = function () {
					return Math.ceil($scope.userAttendaceListingDashboard.length / $scope.pageSize);
					};
			  
			});
			};
			
			
			$scope.ListProducts = function()
			{
				$http({
              method: 'GET'
              , url: 'api/ProductList/'
              , dataType: 'jsonp'
			}).then(function (response) {
              $scope.ProductList = response.data;
			});
			};
			
			$scope.getSrsDetails = function()
			{
				$http({
              method: 'GET'
              , url: 'api/getSrsDetails/'
              , dataType: 'jsonp'
			}).then(function (response) {
              $scope.SrsDetails = response.data;
			  
			   $scope.currentPage = 0;
					$scope.pageSize = 9;
					if($scope.myValue > $scope.SrsDetails.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagessrs = function () {
					return Math.ceil($scope.SrsDetails.length / $scope.pageSize);
					};
			});
			};
			
			
			$scope.Livestatus = function(usersdata)
			{
				$scope.SrsDetailsLive = usersdata;
				$scope.currentPage = 0;
					$scope.pageSize = 9;
					if($scope.myValue > $scope.SrsDetailsLive.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagessrs = function () {
					return Math.ceil($scope.SrsDetailsLive.length / $scope.pageSize);
					};
			};
			
		
			
					
			
			 $scope.addProducts= function() {
					$http({
							    method  : 'POST',
								url     : 'api/addProducts/',
								data    : $scope.product,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.product = null;
						$scope.ListProducts();
					});
				};
				
			$scope.editProduct= function() {
					$http({
							    method  : 'POST',
								url     : 'api/editProduct/',
								data    : $scope.productsDetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.ListProducts();
					});
				};
				
			$scope.getProductData = function(productid)
			{
				$http({
              method: 'GET'
              , url: 'api/GetProduct/'+productid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.productsDetails = response.data;
		  });
			};
			
			$scope.DeleteProduct= function(productid)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/DeleteProduct/'+productid
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						$scope.ListProducts();
		  });
				}
				else
				{}
			};
			
			/*			 INVENTORY        */
			
			$scope.ListStockStratement = function(fromdate,todate)
			{
						var frmdt = new Date();
					if(fromdate == undefined)
				{
					var mm = frmdt.getMonth() + 1;
					if(mm < 10)
						mm = '0'+mm;
					var yy = frmdt.getFullYear();
					var customfromdate = yy+'-'+mm+'-'+'01';
				}
				
				else
				{
				var dd= fromdate.getDate();
					if(dd  < 10)
						dd = '0'+dd;
					var mm = fromdate.getMonth() + 1;
					if(mm < 10)
						mm = '0'+mm;
					var yy = fromdate.getFullYear();
					var customfromdate = yy+'-'+mm+'-'+dd;
				}
				if(todate == undefined)
				{
					
					var tomm = frmdt.getMonth() + 1;
					if(tomm < 10)
						tomm = '0'+tomm;
					var toyy = frmdt.getFullYear();
					var customtodate = toyy+'-'+tomm+'-'+'30';
				}
				
				else
				{
					var todd= todate.getDate();
					if(todd  < 10)
						todd = '0'+todd;
					var tomm = todate.getMonth() + 1;
					if(tomm < 10)
						tomm = '0'+tomm;
					var toyy = todate.getFullYear();
					var customtodate = toyy+'-'+tomm+'-'+todd;
				}
				
				$http({
              method: 'GET'
              , url: 'api/GetStockstatement/'+customfromdate+'/'+customtodate
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.StockStatement = response.data;
			 
			  for(var i = 0 ; $scope.StockStatement.length > i;i++)
			  {
				  if($scope.StockStatement[i].openingbal == null)
					  $scope.StockStatement[i].openingbal = 0;
				  if($scope.StockStatement[i].recqty == null)
					  $scope.StockStatement[i].recqty = 0; 
				  if($scope.StockStatement[i].issuedqty == null)
					   $scope.StockStatement[i].issuedqty = 0; 
			  }
		  });
			};
			
			
			
			
			$scope.Listacpayables = function(vendorid,fromdate,todate)
			{
				if(vendorid == undefined)
				{
					var vendorgetid = '0';
				}
				if(vendorid != undefined)
				{
					var vendorgetid = vendorid;
				}
						
					var frmdt = new Date();

					if(fromdate == undefined)
				{
						

					var mm = frmdt.getMonth() + 1;
					if(mm < 10)
						mm = '0'+mm;
					var yy = frmdt.getFullYear();
					var customfromdate = yy+'-'+mm+'-'+'01';
				}
				
				if(fromdate != undefined)
				{
				var dd= fromdate.getDate();
					if(dd  < 10)
						dd = '0'+dd;
					var mm = fromdate.getMonth() + 1;
					if(mm < 10)
						mm = '0'+mm;
					var yy = fromdate.getFullYear();
					var customfromdate = yy+'-'+mm+'-'+dd;
				}
				if(todate == undefined)
				{
					
					var tomm = frmdt.getMonth() + 1;
					if(tomm < 10)
						tomm = '0'+tomm;
					var toyy = frmdt.getFullYear();
					var customtodate = toyy+'-'+tomm+'-'+'30';
				}
				
				if(todate != undefined)
				{
					var todd= todate.getDate();
					if(todd  < 10)
						todd = '0'+todd;
					var tomm = todate.getMonth() + 1;
					if(tomm < 10)
						tomm = '0'+tomm;
					var toyy = todate.getFullYear();
					var customtodate = toyy+'-'+tomm+'-'+todd;
				}
				
				$http({
              method: 'GET'
              , url: 'api/Getacpayables/'+customfromdate+'/'+customtodate+'/'+vendorgetid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.acpayables = response.data;
			
			  for(var i = 0 ; $scope.acpayables.length > i;i++)
			  {
				  if($scope.acpayables[i].openingbal == null)
					  $scope.acpayables[i].openingbal = 0;
				  if($scope.acpayables[i].credit == null)
					  $scope.acpayables[i].credit = 0; 
				  if($scope.acpayables[i].debit == null)
					   $scope.acpayables[i].debit = 0; 
			  }
		  });
			};
			
			$scope.ListacRecievables = function(fromdate,todate)
			{
						var frmdt = new Date();
					if(fromdate == undefined)
				{
					var mm = frmdt.getMonth() + 1;
					if(mm < 10)
						mm = '0'+mm;
					var yy = frmdt.getFullYear();
					var customfromdate = yy+'-'+mm+'-'+'01';
				}
				
				else
				{
				var dd= fromdate.getDate();
					if(dd  < 10)
						dd = '0'+dd;
					var mm = fromdate.getMonth() + 1;
					if(mm < 10)
						mm = '0'+mm;
					var yy = fromdate.getFullYear();
					var customfromdate = yy+'-'+mm+'-'+dd;
				}
				if(todate == undefined)
				{
					
					var tomm = frmdt.getMonth() + 1;
					if(tomm < 10)
						tomm = '0'+tomm;
					var toyy = frmdt.getFullYear();
					var customtodate = toyy+'-'+tomm+'-'+'30';
				}
				
				else
				{
					var todd= todate.getDate();
					if(todd  < 10)
						todd = '0'+todd;
					var tomm = todate.getMonth() + 1;
					if(tomm < 10)
						tomm = '0'+tomm;
					var toyy = todate.getFullYear();
					var customtodate = toyy+'-'+tomm+'-'+todd;
				}
				
				$http({
              method: 'GET'
              , url: 'api/Getacrecievables/'+customfromdate+'/'+customtodate
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.acrecievables = response.data;
			 
			  for(var i = 0 ; $scope.acrecievables.length > i;i++)
			  {
				  if($scope.acrecievables[i].openingbal == null)
					  $scope.acrecievables[i].openingbal = 0;
				  if($scope.acrecievables[i].credit == null)
					  $scope.acrecievables[i].credit = 0; 
				  if($scope.acrecievables[i].debit == null)
					   $scope.acrecievables[i].debit = 0; 
			  }
		  });
			};
			
			
			/* -----------DASHBOARD-------- */
			
			$scope.getDashboardCount = function(interval)
			{
				$http({
              method: 'GET'
              , url: 'api/getDashboardCount/'+interval+'/'+$scope.userlevel+'/'+$scope.userid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.DashboardCount = response.data;
			  
		  });
			};
			
			
			/* multiline chart */
			
					$scope.getAnualsalereport = function()
			{
				$http({
              method: 'GET'
              , url: 'api/getAnualsalereport/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.AnnualReport = response.data;
					console.log($scope.AnnualReport)
					var chart = AmCharts.makeChart("chartdivMultiline", {
  "type": "serial",
  "theme": "light",
  "dataProvider": $scope.AnnualReport,
  "valueAxes": [{
    "gridColor": "#FFFFFF",
    "gridAlpha": 0.2,
	"integersOnly": true,
    "dashLength": 0
  }],
  "gridAboveGraphs": true,
  "startDuration": 1,
  "graphs": [{
    "title": "Enquiries",
    "balloonText": "[[title]]: <b>[[value]]</b>",
    "bullet": "round",
    "bulletSize": 10,
    "bulletBorderColor": "#ffffff",
    "bulletBorderAlpha": 1,
    "bulletBorderThickness": 2,
	 "lineThickness": 3,
      "lineColor": "#fdd400",
    "valueField": "value1"
  }, {
    "title": "Connections",
    "balloonText": "[[title]]: <b>[[value]]</b>",
    "bullet": "round",
    "bulletSize": 10,
    "bulletBorderColor": "#ffffff",
    "bulletBorderAlpha": 1,
    "bulletBorderThickness": 2,
	 "lineThickness": 3,
      "lineColor": "#009900",
    "valueField": "value2"
  }, {
    "title": "Complaints",
    "balloonText": "[[title]]: <b>[[value]]</b>",
    "bullet": "round",
    "bulletSize": 10,
    "bulletBorderColor": "#ffffff",
    "bulletBorderAlpha": 1,
    "bulletBorderThickness": 2,
	 "lineThickness": 3,
      "lineColor": "#ff0000",
    "valueField": "value3"
  }],
  "chartCursor": {
    "categoryBalloonEnabled": false,
    "cursorAlpha": 0,
    "zoomable": false
  },
  "categoryField": "category",
  "categoryAxis": {
    "gridPosition": "start",
    "gridAlpha": 0
  },
  "legend": {}
});
		  });
			};

			$scope.getPopulerPlans = function()
			{
				$http({
              method: 'GET'
              , url: 'api/getPopulerPlans/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.populerplan = response.data;
				
					var chart = AmCharts.makeChart("chartdivPiachart", {
  "type": "pie",
  "theme": "light",
  "dataProvider":$scope.populerplan ,
  "valueField": "plansaled",
  "titleField": "plan",
   "balloon":{
   "fixedPosition":true
  },
  "listeners": [{
    "event": "init",
    "method": function(event) {
      // apply slice colors to their labels
      var chart = event.chart;
      if (chart.labelColorField === undefined)
        chart.labelColorField = "labelColor";
      for(var i = 0; i < chart.chartData.length; i++) {
        chart.dataProvider[i][chart.labelColorField] = chart.chartData[i].color;
      }
      chart.validateData();
      chart.animateAgain();
    }
  }]
});
		  });
			};
			
			
			
			
			/* CHATTING CODE */
			$scope.GetCurrentLocation = function()
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
											userid : $scope.userid,
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
			};
			$scope.GetCurrentLocation();
			
			
			
			
			/*    RAW MATERIAL */
			
			
			$scope.ListRawStockStratement = function(fromdate,todate)
			{
						var frmdt = new Date();
					if(fromdate == undefined)
				{
					var mm = frmdt.getMonth() + 1;
					if(mm < 10)
						mm = '0'+mm;
					var yy = frmdt.getFullYear();
					var customfromdate = yy+'-'+mm+'-'+'01';
				}
				
				else
				{
				var dd= fromdate.getDate();
					if(dd  < 10)
						dd = '0'+dd;
					var mm = fromdate.getMonth() + 1;
					if(mm < 10)
						mm = '0'+mm;
					var yy = fromdate.getFullYear();
					var customfromdate = yy+'-'+mm+'-'+dd;
				}
				if(todate == undefined)
				{
					
					var tomm = frmdt.getMonth() + 1;
					if(tomm < 10)
						tomm = '0'+tomm;
					var toyy = frmdt.getFullYear();
					var customtodate = toyy+'-'+tomm+'-'+'30';
				}
				
				else
				{
					var todd= todate.getDate();
					if(todd  < 10)
						todd = '0'+todd;
					var tomm = todate.getMonth() + 1;
					if(tomm < 10)
						tomm = '0'+tomm;
					var toyy = todate.getFullYear();
					var customtodate = toyy+'-'+tomm+'-'+todd;
				}
				
				$http({
              method: 'GET'
              , url: 'api/GetRawStockStratement/'+customfromdate+'/'+customtodate
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.StockStatement = response.data;
			  console.log($scope.StockStatement);
			  for(var i = 0 ; $scope.StockStatement.length > i;i++)
			  {
				  if($scope.StockStatement[i].openingbal == null)
					  $scope.StockStatement[i].openingbal = 0;
				  if($scope.StockStatement[i].recqty == null)
					  $scope.StockStatement[i].recqty = 0; 
				  if($scope.StockStatement[i].issuedqty == null)
					   $scope.StockStatement[i].issuedqty = 0; 
			  }
		  });
			};
			
			
			/* USER PROFILE DASHBOARD */
			
			$scope.getAttendanceDetailsOfUser = function(userid)
			{
				var frmdt = new Date();
					
					var mm = frmdt.getMonth() + 1;
					if(mm < 10)
						mm = '0'+mm;
					var yy = frmdt.getFullYear();
					var customfromdate = yy+'-'+mm+'-'+'01';
				
				$http({
              method: 'GET'
              , url: 'api/getAttendanceDetailsOfUser/'+customfromdate+'/'+userid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.userAttendanceDetails = response.data;
			  
		  });
			}
	
/* ADVANCE PAYMENT */
			
			$scope.ListAdvancepayment = function(userid)
			{
					$http({
              method: 'GET'
              , url: 'api/ListAdvancepayment/'+userid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.AdvancePaymentList = response.data;
			  console.log($scope.AdvancePaymentList);
			   $scope.currentPage = 0;
					$scope.pageSize = 5;
					if($scope.myValue > $scope.AdvancePaymentList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagesForAdvance = function () {
					return Math.ceil($scope.AdvancePaymentList.length / $scope.pageSize);
    };
		  });
			};
			
			$scope.GetAdvancepayment = function(id)
			{
					$http({
              method: 'GET'
              , url: 'api/GetAdvancepayment/'+id
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.AdvanceDetails = response.data;
			  $scope.AdvanceDetails[0].paymentmonth = new Date($scope.AdvanceDetails[0].paymentmonth);
			  console.log($scope.AdvanceDetails);
		  });
			};
			
			$scope.DeleteAdvancepayment = function(id)
			{
				var yes = confirm("Are You Sure ?");
				if(yes)
				{
					$http({
              method: 'DELETE'
              , url: 'api/DeleteAdvancepayment/'+id
              , dataType: 'jsonp'
          }).then(function (response) {
              alert(response.data.message)
			  $scope.ListAdvancepayment($scope.AlluserDetails[0].id);
		  });
				}
			};
			
			$scope.AddAdvancePayment= function() {
				$scope.AdvanceDetails[0].createdby = $scope.userid;
				var indianTimeZoneVal = ($scope.AdvanceDetails[0].paymentmonth).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj = new Date(indianTimeZoneVal);
					indainDateObj.setHours(indainDateObj.getHours() + 5);
					indainDateObj.setMinutes(indainDateObj.getMinutes() + 30);
					$scope.AdvanceDetails[0].paymentmonth = indainDateObj;
					
					 $scope.AdvanceDetails[0].userid = $scope.AlluserDetails[0].id;
					
					$http({
							    method  : 'POST',
								url     : 'api/AddAdvancePayment/',
								data    : $scope.AdvanceDetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						$scope.AdvanceDetails = [];
						$scope.ListAdvancepayment($scope.AlluserDetails[0].id);
					});
				};
			
			$scope.SetUserreview = function(selecteduserid,review)
			{
				 var reason = prompt("Please enter reason for review", " ");
					$http({
              method: 'GET'
              , url: 'api/SetUserreview/'+selecteduserid+'/'+review+'/'+$scope.userid+'/'+reason
              , dataType: 'jsonp'
          }).then(function (response) {
              alert(response.data.message)
		  });
			};
			
			
			$scope.getuserMonthlyReview = function(reviewmonth,selecteduserid)
			{
				
				var onlyreviewmonth = reviewmonth.getMonth()+1;
				if(onlyreviewmonth < 10)
					onlyreviewmonth = '0'+onlyreviewmonth;
				
					$http({
              method: 'GET'
              , url: 'api/getuserMonthlyReview/'+onlyreviewmonth+'/'+selecteduserid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.userreviewcounts = response.data;
			  console.log($scope.userreviewcounts)
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
				console.log($scope.VendorListing);
				 
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
					
					socket.on('NewEnquiry', function(data){
							$scope.getDashboardCount('Today'); 
							$scope.getAnualsalereport(); 
							$scope.getPopulerPlans(); 
					});
			
			
			/* srtock report */
			
			$scope.ListStockSRN= function()
			{
				$http({
              method: 'GET'
              , url: 'api/ListStockSRN/'
              , dataType: 'jsonp'
          }).then(function (response) {
				$scope.StocksrnList = response.data;	
					$scope.currentPage = 0;
					$scope.pageSize = 10;
					$scope.numberOfPagesofstocksrn = function () {
					return Math.ceil($scope.StocksrnList.length / $scope.pageSize);
				};
		  });
				
			};
			
			
	
});