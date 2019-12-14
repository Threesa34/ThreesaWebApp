  var MasterApp = angular.module('VendorApp', ['ui.bootstrap','ja.qr']).filter('startFrom', function () {
    return function (input, start) {
        start = +start;
       if(input!=undefined)
        {return input.slice(start);}
    }
}); 
  MasterApp.controller('vendorController', function($scope,$http,$window, $filter) {
	  
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
			
			
			$scope.ListUser = function () {
          $http({
              method: 'GET'
              , url: 'api/userList/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.userList = response.data;
			  
			  $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.userList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.userList.length / $scope.pageSize);
		};
			  
          });
		  
      };
			
			/* Stock Entry */
			$scope.ListArea= function()
			{
				$http({
              method: 'GET'
              , url: 'api/AreaList/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.AreaList= response.data;
		  });
			};
			
			$scope.qrcode =[{'qrcodeString':'','size':''}];
			
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
					if($scope.myValue > $scope.StocksrnList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagesofstocksrn = function () {
					return Math.ceil($scope.StocksrnList.length / $scope.pageSize);
    };
	
			});	
			};
			
			$scope.ListPurchaeStock= function()
			{
				$scope.Pagesizes = [{value:10,name:10},{value:25,name:25},{value:50,name:50},{value:100,name:100}];
				$http({
              method: 'GET'
              , url: 'api/ListPurchaeStock/'
              , dataType: 'jsonp'
          }).then(function (response) {
				$scope.StocksrnList = response.data;	
				if($scope.StocksrnList.length > 0)
				{
					$scope.Pagesizes.push({value:$scope.StocksrnList.length,name:'All'})
					$scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.StocksrnList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagesofstocksrn = function () {
					return Math.ceil($scope.StocksrnList.length / $scope.pageSize);
					};
				}
	
			});	
			};
			
			
			
			$scope.GenerateQrCode = function(data)
	{					
					
				//  data.barcodevalue = '_PO.: '+String(data.grid)+'_SrNo: '+String(data.srno)+'_AssignEmployee: '+String(data.assignempname)+'_Address: '+String(data.address)+'_Zone: '+String(data.zonename)+'_AssignDate: '+(data.assigndate1)
				
				 data.barcodevalue = 'https://103.252.7.5:8898/itemUsedDetails.html?'+String(data.srno)+'?'+String(data.grid);
				
				$scope.qrcode[0].qrcodeString = data.barcodevalue;
				$scope.qrcode[0].size = 55;
				$scope.qrcode[0].correctionLevel = '';
				$scope.qrcode[0].typeNumber = 0;
				$scope.qrcode[0].inputMode = '';
				$scope.qrcode[0].image = true;
			
			 $scope.bc = {
    format: 'CODE128',
    lineColor: '#000000',
    width: 1,
    height: 30,
    displayValue: true,
    fontOptions: '',
    font: 'monospace',
    textAlign: 'center',
    textPosition: 'bottom',
    textMargin: 2,
    fontSize: 8,
    background: '#ffffff',
    margin: 0,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    valid: function (valid) {
    }
} 
		
		
	};
			
			
			
			
			$scope.printDiv =function(divName)
			{
			var printContents = document.getElementById(divName).innerHTML;
		var originalContents = document.body.innerHTML;
		document.body.innerHTML = printContents;
		window.print();
		document.body.innerHTML = originalContents;
		window.location.reload();
			};
			
			
			$scope.listGrForStockEntry= function()
			{
				$http({
              method: 'GET'
              , url: 'api/listGrForStockEntry/'
              , dataType: 'jsonp'
          }).then(function (response) {
				$scope.StckEntryListing = response.data;	
		  });
				
			};
			
			$scope.getItemsIngr= function(grid)
			{
				$http({
              method: 'GET'
              , url: 'api/getItemsIngr/'+grid
              , dataType: 'jsonp'
          }).then(function (response) {
				$scope.ItemsInGR = response.data;			
		  });
				
			};
			$scope.itemsqtylength = [];
			
			$scope.getSeectedItemQty= function(productid)
			{
				$scope.ItemQty = $filter('filter')($scope.ItemsInGR, {productsid:productid});
				console.log($scope.ItemQty);
				for(var i =0; i < $scope.ItemQty[0].qty;i++)
				{
					$scope.itemsqtylength.push({'srno':''});
				}
			};
			
			
			
			$scope.DeleteOffice= function(id)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/DeleteOffice/'+id
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
		  });
				}
				else
				{}
			};
			
			$scope.AddItemsInStocks = function () {
				$scope.itemsqtylength[0].productsid = $scope.ItemQty[0].productsid;
				$scope.itemsqtylength[0].poid = $scope.ItemQty[0].poid;
				$scope.itemsqtylength[0].createdby = $scope.userid;
		$http({
							    method  : 'POST',
								url     : 'api/AddItemsInStocks/',
								data    : $scope.itemsqtylength ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
							alert(data.message);
							$scope.office = [];
							$scope.ListStockSRN();
					});
    };
			
			$scope.UpdateofficeDetails = function () {
		$http({
							    method  : 'POST',
								url     : 'api/UpdateOfficeDetails/',
								data    : $scope.officeDetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
							alert(data.message);
							$scope.officeList(); 
					});
    };
	
	
			$scope.getUsedItems = function (itemdetails) {
				$scope.itemdetailsReq = itemdetails;
						$http({
							    method  : 'POST',
								url     : 'api/getUsedItems/',
								data    : itemdetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
							$scope.ItemDetails = data;
							$scope.ItemDetails.map(function(value){
								value.assigndate = new Date(value.assigndate);
								value.poid = itemdetails.poid;
								value.grid = itemdetails.grid;
								value.productsid = itemdetails.productsid;
							});
					});
    };
	
	$scope.SaveSRNData = function (stocksrndata) {
						
						
						stocksrndata.createdby = $scope.userid;
						$http({
							    method  : 'POST',
								url     : 'api/SaveSRNData/',
								data    : stocksrndata ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
							alert(data.message);
							$scope.getUsedItems(stocksrndata);
					});
    };
	
	var lastindex = '';
	$scope.OpenQrPopup = function(index,srnid)
	{
		
		
		if(lastindex >= 0)
		$('#row'+lastindex).popover().popover('hide');
	
	
		

			var qrcodeString = 'office.treesainfoway.net?'+String(srnid);
	
		var title = 'QR Code';
		
		
        var content = '<qr text="'+qrcodeString+'" type-number="0" correction-level="" size="35" input-mode="" image="true"></qr>';
		
		console.log(content);
		  lastindex = index;
	  $('#row'+index).popover({
        html: true,
        title: title,
        content: content,
        placement: 'right',
      }).popover('show');
	}
	
	
		
				 
	
			$scope.printDiv =function(divName)
			{
			var printContents = document.getElementById(divName).innerHTML;
		var originalContents = document.body.innerHTML;
		document.body.innerHTML = printContents;
		window.print();
		document.body.innerHTML = originalContents;
		window.location.reload();
			};
			
				$scope.ListPo = function()
			{
				$http({
              method: 'GET'
              , url: 'api/Listpo/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.poList = response.data;
				$scope.poList.push({'id':'All'});
			 
		
		  });
			};
			
				$scope.getpoidentry= function(grid)
			{
				
				if(grid == 'All')
				{
					$scope.ListStockSRN();
				}
			else
			{
				
				$scope.poidget = grid;
				$http({
              method: 'GET'
              , url: 'api/getpoidentry/'+grid
              , dataType: 'jsonp'
          }).then(function (response) {
				$scope.StocksrnList = response.data;
				
				
								
				
		  });
			}
				
			};
			
			
			
			$scope.setQrValues = function(data)
				{
					$scope.assignstock = [];data;
					$scope.assignstock.push(data);
					$scope.assignstock[0].assignedfrom =$scope.userid;
					$http({
								method  : 'POST',
								url     : 'api/setQrValues/',
								data    : $scope.assignstock[0] ,
								headers : {'Content-Type': 'application/json'} 
				}).success(function(data) {
			});
			};
			
			
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


					$scope.getItemDetails = function()
					{
						var url = window.location.href;
						var qparts = url.split("?");
						var serialno = qparts[1];
						var grid = qparts[2];

						$http({
							method: 'GET'
							, url: 'api/getpoitemdetails/'+serialno+'/'+grid
							, dataType: 'jsonp'
						}).then(function (response) {
							  $scope.poItemUsedDetails = response.data; 
						});


					}
			
			
			});