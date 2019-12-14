  var MasterApp = angular.module('VendorApp', ['ui.bootstrap']).filter('startFrom', function () {
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
			
			/* PRODUCTS */
			
			
			      $scope.SelectedProducts = [];
			      $scope.ProductsForPO = [{}];
				  
  $scope.sync = function(bool, item){
    if(bool){
      // add item
		$scope.SelectedProducts.push(item);
	
    } else {
      // remove item
      for(var i=0 ; i < $scope.SelectedProducts.length; i++) {
        if($scope.SelectedProducts[i].id == item.id){
          $scope.SelectedProducts.splice(i,1);
        }
      }         
    }
  };
 
	
         
	  $scope.isChecked = function(product){
		
      var match = false;
      for(var i=0 ; i < $scope.SelectedProducts.length; i++) {
		
					if($scope.SelectedProducts[i].id == product.id){
					  match = true;
					}
		  
      }
      return match;
  };  
		
		
		
		$scope.getreleventDat = function(item)
		{
			 item.porate = item.product.mrp ? item.product.mrp : 0;
			 item.qty =  0;
		};
		
		
		$scope.CalculateProductAmount = function(data)
		{
			if(data.product)
			{
				var amount = 0;
				var baseamount = parseFloat(data.porate * data.qty * (data.measure?data.measure:1));
				/* var gst = parseFloat(data.product.cgst) + parseFloat(data.product.sgst);
				var taxamount = parseFloat(baseamount) *  parseFloat(gst / 100);
				 */
				/* return  amount = parseFloat(taxamount) + parseFloat(baseamount); */
				return  amount = parseFloat(baseamount);
			}
		};
		
		
		$scope.taxamt = 0;
		$scope.netamt = 0;
		$scope.calculategroass = function(index)
		{
			$scope.grsamt = 0;
			
			$scope.ProductsForPO.map((value) =>
			{
				$scope.grsamt = $scope.grsamt + (parseFloat(value.measure ? value.measure : 1) * parseFloat(value.qty ? value.qty : 0) * parseFloat(value.porate ? value.porate :0));
			});
			
			//$scope.grsamt += (parseFloat($scope.ProductsForPO[index].porate ? $scope.ProductsForPO[index].porate : 0 ) * parseFloat($scope.ProductsForPO[index].qty ? $scope.ProductsForPO[index].qty : 0 ));
			
			//$scope.netamt += parseFloat($scope.ProductsForPO[index].amount?$scope.ProductsForPO[index].amount:0);
			
			//$scope.taxamt = parseFloat($scope.netamt)  - parseFloat($scope.grsamt);
		};
		
		
		$scope.calculatGST = function(obj)
		{
			
			if($scope.PurchaseDetails)
			{
				$scope.PurchaseDetails[0].taxamount = parseFloat($scope.PurchaseDetails[0].grossamount ) * parseFloat((parseFloat(obj.cgst?obj.cgst:0) + parseFloat(obj.sgst?obj.sgst:0) + parseFloat(obj.igst?obj.igst:0)) / 100);
			
				$scope.PurchaseDetails[0].netamount = parseFloat($scope.PurchaseDetails[0].grossamount ) + parseFloat($scope.PurchaseDetails[0].taxamount);
			}
			else
			{
					$scope.taxamt = parseFloat($scope.grsamt) * parseFloat((parseFloat(obj.cgst?obj.cgst:0) + parseFloat(obj.sgst?obj.sgst:0) + parseFloat(obj.igst?obj.igst:0)) / 100);
				
					$scope.netamt = parseFloat($scope.grsamt) + parseFloat($scope.taxamt);
			}
				
		}
		
		$scope.AddNewRowPO = function()
		{
			
			var prdexist = $scope.ProductsForPO.filter((value) =>{
					return ((value.product === "" || !value.product ) || (value.porate === 0 || !value.porate ) || (value.qty === 0 || !value.qty))
			});
			if(prdexist.length > 0)
			{return false}
				else
				{
					$scope.ProductsForPO.push({});
				}
		}
		
		$scope.RemovePoPrduct = function(data,ind)
		{
			var rmprd = $scope.ProductsForPO.filter((value,index) =>{
					return ind ===  index;
			});
				 if(rmprd.length > 0)
				{
					$scope.ProductsForPO.splice(ind,1);
				}
		};
		
		
		$scope.SavePurchaseOrder = function()
		{
			$scope.ProductsForPO[0].createdby = $scope.userid;
			$scope.ProductsForPO[0].grossamount = $scope.grsamt;
			$scope.ProductsForPO[0].taxamount = $scope.taxamt;
			$scope.ProductsForPO[0].netamount = $scope.netamt;
			$http({
							    method  : 'POST',
								url     : 'api/SavePurchaseOrder/',
								data    : $scope.ProductsForPO ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						 location.reload(); 
					});
		
		};
		
		
		$scope.ListPurchases = function()
				{
			$http({
              method: 'GET'
              , url: 'api/ListPurchases/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.poList = response.data;
		  });
		};

		
		$scope.ItemsList = function()
				{
			$http({
              method: 'GET'
              , url: 'api/ListItem/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.ItemsListing = response.data;
		  });
		};
		
		
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
		/* ---------------------------- */
			
			
			$scope.exportData = function (report) {
			$scope.pageSize=10;
		$scope.currentPage=0;
         var blob = new Blob([document.getElementById('exportablenew').innerHTML], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" 
        });
        saveAs(blob,report);
    };
			
			
			
				
				/* PURCHASE */
			
			$scope.ListPo = function()
			{
				$http({
              method: 'GET'
              , url: 'api/Listpo/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.poList = response.data;
			 $scope.model = {
        contacts: $scope.poList,
        selected: {}
    };
			 
			  $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.poList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.poList.length / $scope.pageSize);
    };
		  });
			};
			
			$scope.fix = true;
			$scope.update = false;
			
			

    // gets the template to ng-include for a table row / item
    $scope.getTemplate = function (contact) {
        if (contact.id === $scope.model.selected.id) return 'edit';
        else return 'display';
    };

    $scope.editContact = function (contact) {
        $scope.model.selected = angular.copy(contact);
    };

    $scope.saveContact = function (data) {
		$http({
							    method  : 'POST',
								url     : 'api/Editpurchase/',
								data    : data ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						 $scope.ListPo(); 
					});
		
        $scope.reset();
    };

   

   
    $scope.reset = function () {
        $scope.model.selected = {};
    };
			
			
			
			 $scope.setPage = function (pageNo) {
			 $scope.currentPage = pageNo;
				};
			 $scope.filter = function () {
			 $timeout(function () {
			 $scope.filteredItems = $scope.poList.length;
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
			
			$scope.getpoData = function(poid)
			{
				$http({
              method: 'GET'
              , url: 'api/Getpodetails/'+poid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.ProductsForPO = response.data;
			 // $scope.seletecdprdtableedit = true;
		  });
			};
			
			
			$scope.GetPurchaseId = function(poid)
			{
				$http({
              method: 'GET'
              , url: 'api/GetPurchaseId/'+poid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.PurchaseDetails = response.data;
			 $scope.PurchaseDetails[0].invoicedate = new Date($scope.PurchaseDetails[0].invoicedate);
		  });
			};
			
			$scope.AddNewRowPOEdit = function()
			{
				var prdexist = $scope.PurchaseDetails.filter((value) =>{
					return ((value.product === "" || !value.product ) || (value.porate === 0 || !value.porate ) || (value.qty === 0 || !value.qty))
			});
			if(prdexist.length > 0)
			{return false}
				else
				{
					$scope.PurchaseDetails.push({});
				}	
			};
			
			$scope.calculategroassEdit  =function(index)
			{

			  $scope.PurchaseDetails[0].grossamount = 0;
			  
				$scope.PurchaseDetails[0].grossamount = $scope.PurchaseDetails[0].grossamount + parseFloat($scope.PurchaseDetails[index].netvalue?$scope.PurchaseDetails[index].netvalue:0);
				
			
				
				$scope.PurchaseDetails[0].taxamount = (parseFloat($scope.PurchaseDetails[0].grossamount) * parseFloat(($scope.PurchaseDetails[0].cgst+ $scope.PurchaseDetails[0].sgst + $scope.PurchaseDetails[0].igst)/100));
				
				$scope.PurchaseDetails[0].netamount = parseFloat($scope.PurchaseDetails[0].grossamount) + parseFloat($scope.PurchaseDetails[0].taxamount)
			}
			
			$scope.RemovePoPrductAtEdit = function(index,podetails)
				{
					
					if(podetails.detailsid)
					{
					
					 $http({
							    method  : 'POST',
								url     : 'api/RemovePoPrductAtEdit/',
								data    : podetails,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						$scope.GetPurchaseId(podetails.masterid);	
				}); 
					}
					else
					{
						$scope.PurchaseDetails.splice(index,1);
					}
			};
			
			$scope.UpdatePurchaseOrder = function()
				{
					
					
					
					 $http({
							    method  : 'POST',
								url     : 'api/UpdatePurchaseOrder/',
								data    : $scope.PurchaseDetails,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						location.reload();
				}); 
					
			};
			
			
			$scope.SaveGrDetails = function()
				{
					
					$scope.PurchaseDetails[0].createdby = $scope.userid;
					
					 $http({
							    method  : 'POST',
								url     : 'api/SaveGrDetails/',
								data    : $scope.PurchaseDetails,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						location.reload();
				}); 
					
			};
			
			 $scope.syncedit = function(bool, item){
    if(bool){
      // add item		
		$scope.poDetails.push(item);
	
    } else {
      // remove item
      for(var i=0 ; i < $scope.poDetails.length; i++) {
        if($scope.poDetails[i].id == item.id){
          $scope.poDetails.splice(i,1);
        }
      }         
    }
  };
 
	
         
	  $scope.isCheckededit = function(product){
		
      var match = false;
	  if($scope.poDetails && !$scope.poDetails)
	  {
      for(var i=0 ; i < $scope.poDetails.length; i++) {
		
					if($scope.poDetails[i].id == product.id){
					  match = true;
					}
		  
      }
	  }
	  if($scope.poDetails)
	  {
		  for(var i=0 ; i < $scope.poDetails.length; i++) {
		
					if($scope.poDetails[i].productid == product.id){
						document.getElementById($scope.poDetails[i].productid).disabled = true;
					  match = true;
					}
		  
      }
	  }
      return match;
  }; 
			
			$scope.Deletepo= function(poid)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/Deletepo/'+poid
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						$scope.ListPo();
		  });
				}
				else
				{}
			};
			
			
			
			
			  $scope.AddNewPO= function() {
				 $scope.SelectedProducts[0].vendor = $scope.vendor;
				  $scope.SelectedProducts[0].grossamount = $scope.grossamount;
				  $scope.SelectedProducts[0].taxamount = $scope.taxamount;
				  $scope.SelectedProducts[0].netamount = $scope.netamount;
				  $scope.SelectedProducts[0].createdby = $scope.userid;
					$http({
							    method  : 'POST',
								url     : 'api/addPO/',
								data    : $scope.SelectedProducts,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.ListPo();
					});
				};
				
				
				$scope.Editpurchase = function() {
					
					$http({
							    method  : 'POST',
								url     : 'api/Editpurchase/',
								data    : $scope.poDetails,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.ListPo();
					});
				};
				
		$scope.grossamount = 0;
		$scope.taxamount = 0;
		$scope.netamount = 0;
		
		
		$scope.setfinalamounts = function(netvalue)
	{
		
		
			var txper = 0;
			
			$scope.grossamount = $scope.grossamount + parseFloat(netvalue) ;
			$scope.taxamount =  	$scope.taxamount + (parseFloat(netvalue) * (parseInt(txper)/100))
			$scope.netamount = parseFloat($scope.grossamount) + parseFloat($scope.taxamount);
	
	};
		
					 
		
					$scope.setfinalamounts1 = function(index)
					{
							if($scope.SelectedProducts[index].measure == undefined)
							{
								$scope.SelectedProducts[index].measure = 1;
							}
							
							if($scope.SelectedProducts[index].porate == undefined)
							{
								$scope.SelectedProducts[index].porate = 0;
							}
							
							if($scope.SelectedProducts[index].qty == undefined)
							{
								$scope.SelectedProducts[index].qty = 0;
							}
							 $scope.SelectedProducts[index].amount = $scope.SelectedProducts[index].measure * $scope.SelectedProducts[index].qty * $scope.SelectedProducts[index].porate
							$scope.setfinalamounts($scope.SelectedProducts[index].amount);
					};
					
					$scope.setfinalamounts1edit = function(index)
					{
						var txper = 0;
			
						if($scope.poDetails[index].measure == undefined)
							{
								$scope.poDetails[index].measure = 1;
							}
							
							
							if($scope.poDetails[index].porate == undefined)
							{
								$scope.poDetails[index].porate = 0;
							}
							
							if($scope.poDetails[index].qty == undefined)
							{
								$scope.poDetails[index].qty = 0;
							}
							
							$scope.poDetails[0].grossamount = $scope.poDetails[0].grossamount - parseFloat($scope.poDetails[index].netvalue);
							
							$scope.poDetails[0].taxamount =  $scope.poDetails[0].taxamount - (parseFloat($scope.poDetails[index].netvalue) * (parseInt(txper)/100))
							
			$scope.poDetails[0].netamount = parseFloat($scope.poDetails[0].grossamount) - parseFloat($scope.poDetails[0].taxamount);
							
							 $scope.poDetails[index].netvalue = $scope.poDetails[index].measure * $scope.poDetails[index].qty * $scope.poDetails[index].porate
							$scope.setfinalamountsedit($scope.poDetails[index].netvalue);
					};
					
					$scope.setfinalamountsedit = function(netvalue)
					{
					
					 
					 var txper = 0;
			
			$scope.poDetails[0].grossamount = $scope.poDetails[0].grossamount + parseFloat(netvalue) ;
			$scope.poDetails[0].taxamount =  $scope.poDetails[0].taxamount + (parseFloat(netvalue) * (parseInt(txper)/100))
			$scope.poDetails[0].netamount = parseFloat($scope.poDetails[0].grossamount) + parseFloat($scope.poDetails[0].taxamount);
					
				  $scope.poDetails[0].netamount =  parseFloat($scope.poDetails[0].grossamount) + parseFloat($scope.poDetails[0].taxamount);
		};
		
					
					
					
			$scope.Listusedstock = function()
			{
				$http({
              method: 'GET'
              , url: 'api/Listusedstock/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.usedqtylist = response.data;
			   $scope.usedstock = {
						list: $scope.usedqtylist,
						selectedusedqty: {}
					};
			 
			  $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.usedqtylist.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.usedqtylist.length / $scope.pageSize);
    };
			  
		  });
			};
			
			
			
			 // gets the template to ng-include for a table row / item
    $scope.getTemplateusedqty = function (contact) {
        if (contact.id === $scope.usedstock.selectedusedqty.id) return 'edit';
        else return 'display';
    };

    $scope.edituseditem = function (contact) {
        $scope.usedstock.selectedusedqty = angular.copy(contact);
    };

    $scope.saveuseditem = function (data) {
		$http({
							    method  : 'POST',
								url     : 'api/EditUsedqty/',
								data    : data ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
							alert(data.message);
						 $scope.Listusedstock(); 
					});
        $scope.resetdata();
    };

   

   
    $scope.resetdata = function () {
        $scope.usedstock.selectedusedqty = {};
    };
				
				$scope.AddusedStock= function() {
					$scope.stock.createdby = $scope.userid;
					var indianTimeZoneVal = ($scope.stock.useddate).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj = new Date(indianTimeZoneVal);
					indainDateObj.setHours(indainDateObj.getHours() + 5);
					indainDateObj.setMinutes(indainDateObj.getMinutes() + 30);
					$scope.stock.useddate = indainDateObj;
					$http({
							    method  : 'POST',
								url     : 'api/AddusedStock/',
								data    : $scope.stock ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.Listusedstock();
					});
				};
			
			$scope.DeleteUsedqty= function(id)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/DeleteUsedqty/'+id
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						$scope.Listusedstock();
		  });
				}
				else
				{}
			};
			
			
			
			
			/* GOODS RECIRPT */
			
				$scope.ListPoForGr = function()
			{
				$http({
              method: 'GET'
              , url: 'api/ListPoForGr/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.poListForGR = response.data;
		  });
			};
			
			$scope.ListGR = function()
			{
				$http({
              method: 'GET'
              , url: 'api/ListGR/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.GRList = response.data;
			  $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.GRList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.GRList.length / $scope.pageSize);
    };
			  
		  });
			};
		  
		  $scope.setPage = function (pageNo) {
			 $scope.currentPage = pageNo;
				};
			 $scope.filter = function () {
			 $timeout(function () {
			 $scope.filteredItems = $scope.GRList.length;
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
		  
		  $scope.getGRData = function(grid)
			{
				$http({
              method: 'GET'
              , url: 'api/getGRData/'+grid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.GRDetails = response.data; 
			  $scope.GRDetails[0].invoicedate = new Date($scope.GRDetails[0].invoicedate);
			  
			  //($scope.GRDetails[0].invoicedate).substr(6, 10)+"/"+($scope.GRDetails[0].invoicedate).substr(3, 2)+"/"+($scope.GRDetails[0].invoicedate).substr(0, 2)
		  });
			};
			
			$scope.DeleteGR = function(grid)
			{
				var yes =confirm("Are You Sure ?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/DeleteGR/'+grid
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						$scope.ListGR();
			 });
				}
				else
				{
					
				}
			};
			
			
				$scope.AddGrDetails= function() {
					$scope.poDetails[0].createdby = $scope.userid;
					var dd = $scope.poDetails[0].invoicedate.getDate();
					if(dd < 10)
						dd = '0'+dd;
					var mm = $scope.poDetails[0].invoicedate.getMonth() + 1;
					if(mm < 10)
						mm ='0'+mm;
					var yyyy = $scope.poDetails[0].invoicedate.getFullYear();
					$scope.poDetails[0].invoicedate = dd+'/'+mm+'/'+yyyy;
					$http({
							    method  : 'POST',
								url     : 'api/AddGr/',
								data    : $scope.poDetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						// $scope.ListGR();
						location.reload();
					});
				};
			
			
			
		
			
			$scope.setfinalgramountsedit = function(netvalue)
					{
					
					 
					 var txper = 0;
			
			$scope.GRDetails[0].grossamount = $scope.GRDetails[0].grossamount + parseFloat(netvalue) ;
			$scope.GRDetails[0].taxamount =  $scope.GRDetails[0].taxamount + (parseFloat(netvalue) * (parseInt(txper)/100))
			$scope.GRDetails[0].netamount = parseFloat($scope.GRDetails[0].grossamount) + parseFloat($scope.GRDetails[0].taxamount);
			$scope.GRDetails[0].netamount =  parseFloat($scope.GRDetails[0].grossamount) + parseFloat($scope.GRDetails[0].taxamount);
		};
			
			
				
			$scope.setfinalamountsGr = function(index)
					{
						if($scope.GRDetails[index].measure == undefined)
							{
								$scope.GRDetails[index].measure = 1;
							}
							
							var txper = 0;
			
						
							$scope.GRDetails[0].grossamount = $scope.GRDetails[0].grossamount - parseFloat($scope.GRDetails[index].netvalue);
							
							$scope.GRDetails[0].taxamount =  $scope.GRDetails[0].taxamount - (parseFloat($scope.GRDetails[index].netvalue) * (parseInt(txper)/100))
							
					$scope.GRDetails[0].netamount = parseFloat($scope.GRDetails[0].grossamount) - parseFloat($scope.GRDetails[0].taxamount);
							
							 $scope.GRDetails[index].netvalue = $scope.GRDetails[index].measure * $scope.GRDetails[index].qty * $scope.GRDetails[index].porate
							$scope.setfinalgramountsedit($scope.GRDetails[index].netvalue);
					};
					
			/* $scope.setfinalgramountsedit = function()
					{
					$scope.GRDetails[0].grossamount = 0;
					$scope.GRDetails[0].taxamount = 0;
					 $scope.GRDetails[0].netamount = 0;
					for(var i = 0;i < $scope.GRDetails.length;i++)
						{
							$scope.GRDetails[0].grossamount = $scope.GRDetails[0].grossamount + $scope.GRDetails[i].amount;
							$scope.GRDetails[0].taxamount = parseFloat($scope.GRDetails[0].taxamount) + (parseFloat($scope.GRDetails[i].amount) * (parseInt($scope.GRDetails[i].taxpercent)/100));
						}
					
				  $scope.GRDetails[0].netamount =  parseFloat($scope.GRDetails[0].grossamount) + parseFloat($scope.GRDetails[0].taxamount);
		}; */
			
			$scope.EditGrDetails= function() {
				
					/* var dd = $scope.GRDetails[0].invoicedate.getDate();
					if(dd < 10)
						dd = '0'+dd;
					var mm = $scope.GRDetails[0].invoicedate.getMonth() + 1;
					if(mm < 10)
						mm ='0'+mm;
					var yyyy = $scope.GRDetails[0].invoicedate.getFullYear();
					$scope.GRDetails[0].invoicedate = dd+'/'+mm+'/'+yyyy; */
					$http({
							    method  : 'POST',
								url     : 'api/EditGr/',
								data    : $scope.GRDetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.ListGR();
					});
				};
			
				$scope.UploadGoodsdata= function(Goodsdetails)
			{
					Goodsdetails[0].createdby = $scope.userid;
				$http({
							    method  : 'POST',
								url     : 'api/UploadGoodsdata/',
								data    : Goodsdetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						 $scope.ListGR(); 
					});
			};	
				
			
			
			
			
			/* vendor */
			
			
			$scope.VendorList= function()
			{
				$http({
              method: 'GET'
              , url: 'api/VendorList/'
              , dataType: 'jsonp'
          }).then(function (response) {
				$scope.VendorListing = response.data;	
				 $scope.currentPage = 0;
					$scope.pageSize = 15;
					if($scope.myValue > $scope.VendorListing.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagesvendor = function () {
					return Math.ceil($scope.VendorListing.length / $scope.pageSize);
    };
		  });
				
			};
			
			$scope.getvendorData= function(id)
			{
				$http({
              method: 'GET'
              , url: 'api/getvendorData/'+id
              , dataType: 'jsonp'
          }).then(function (response) {
				$scope.vendorDetails = response.data;	
		  });
				
			};
			
			$scope.Deletevendor= function(id)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/Deletevendor/'+id
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						$scope.VendorList();
		  });
				}
				else
				{}
			};
			
			$scope.AddNewVendor = function () {
		$http({
							    method  : 'POST',
								url     : 'api/AddNewVendor/',
								data    : $scope.vendor ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
							alert(data.message);
							$scope.VendorList(); 
							$scope.vendor = null;
					});
    };
			
			$scope.UpdateVendorDetails = function () {
		$http({
							    method  : 'POST',
								url     : 'api/UpdateVendorDetails/',
								data    : $scope.vendorDetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
							alert(data.message);
							$scope.VendorList(); 
					});
    };
	
	
	
	/* VENDOR PAYMENTS DETAILS   monisha code */
			
			
				$scope.ListvendorsPaymets = function()
			{
				$http({
              method: 'GET'
              , url: 'api/ListvendorsPaymets/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.vendorpaymentList = response.data;
			  $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.vendorpaymentList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.vendorpaymentList.length / $scope.pageSize);
             };
			  
		  });
			};
			
			
			
		$scope.tableRowExpanded = false;
    $scope.tableRowIndexExpandedCurr = "";
    $scope.tableRowIndexExpandedPrev = "";
    $scope.storeIdExpanded = "";
    
    $scope.PaymentDataCollapseFn = function () {
        $scope.PaymentDataCollapse = [];
        for (var i = 0; i < $scope.vendorpaymentList.length; i += 1) {
            $scope.PaymentDataCollapse.push(false);
        }
    };
	
	
	var activeindex = 0;
	
	 $scope.GetVendorsPaymentsPoviseDetails = function(index,poid)
  {
	  activeindex = index;
	  $scope.totalnetamount = 0;
$http({
                  method: 'GET',
                  url: 'api/GetVendorsPaymentsPoviseDetails/'+poid,
                  dataType: 'jsonp'
              })
              .then(function (response) {
                  $scope.PovisePaymentsDetails = response.data;
					console.log($scope.PovisePaymentsDetails)
					 $scope.mydata1 = true;
				
		
        if (typeof $scope.PaymentDataCollapse === 'undefined') {
            $scope.PaymentDataCollapseFn();
        }

        if ($scope.tableRowExpanded === false && $scope.tableRowIndexExpandedCurr === "" && $scope.storeIdExpanded === "") {
            $scope.tableRowIndexExpandedPrev = "";
            $scope.tableRowExpanded = true;
            $scope.tableRowIndexExpandedCurr = index;
            $scope.storeIdExpanded =poid;
            $scope.PaymentDataCollapse[index] = true;
        } else if ($scope.tableRowExpanded === true) {
            if ($scope.tableRowIndexExpandedCurr === index && $scope.storeIdExpanded === poid) {
                $scope.tableRowExpanded = false;
                $scope.tableRowIndexExpandedCurr = "";
                $scope.storeIdExpanded = "";
                $scope.PaymentDataCollapse[index] = false;
            } else {
                $scope.tableRowIndexExpandedPrev = $scope.tableRowIndexExpandedCurr;
                $scope.tableRowIndexExpandedCurr = index;
                $scope.storeIdExpanded = poid;
                $scope.PaymentDataCollapse[$scope.tableRowIndexExpandedPrev] = false;
                $scope.PaymentDataCollapse[$scope.tableRowIndexExpandedCurr] = true;
            }
        }
 });
  };  
  
	
			
			
				$scope.ListPoForGrpay = function()
			{
				$http({
              method: 'GET'
              , url: 'api/ListPoForGrpay/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.poListForGR = response.data;
			
		  });
			};
			
			
			$scope.vendor = null;
		 $scope.getPoOnVendorfromgr = function(vendorid)
			{
				$http({
              method: 'GET'
              , url:  'api/getPoOnVendorfromgr/'+vendorid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.gronvendors = response.data;
		  });
		 return $scope.vendor = vendorid;
			};
			
			$scope.pay = true;
			
			$scope.getAmountDetailsOnGr = function(grid)
			{
				$http({
              method: 'GET'
              , url: 'api/getAmountDetailsOnGr/'+grid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.PaymentdetailsOnGr = response.data;
			$scope.PaymentdetailsOnGr[0].paymentmode = "Cash";
		  });
			};
			
			
			
			
			$scope.Addvendorpayment= function() {
				$scope.PaymentdetailsOnGr[0].vendor = $scope.vendor;
				
				if($scope.PaymentdetailsOnGr[0].chqdate)
				{
					var indianTimeZoneVal = ($scope.PaymentdetailsOnGr[0].chqdate).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj = new Date(indianTimeZoneVal);
					indainDateObj.setHours(indainDateObj.getHours() + 5);
					indainDateObj.setMinutes(indainDateObj.getMinutes() + 30);
					$scope.PaymentdetailsOnGr[0].chqdate = indainDateObj;
				}
					$http({
							    method  : 'POST',
								url     : 'api/Addvendorpayment/',
								data    : $scope.PaymentdetailsOnGr[0] ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
					      location.reload(); 
					});
				};
				
		 $scope.getPaymentDetails = function(id) { 
             $http(
	        	{
                     method: 'GET',
            url: 'api/getPaymentDetails/'+id,
            dataType: 'jsonp'
                }
	       )
          .then(function(response){ 
			$scope.vendorpayDetails= response.data;
			$scope.vendorpayDetails[0].paymentmodenew = "Cash";
			$scope.vendorpayDetails[0].chqdate=new Date($scope.vendorpayDetails[0].chqdate);
			$scope.vendorpayDetails[0].grinvoicedate=new Date($scope.vendorpayDetails[0].grinvoicedate);
		  
	
          });
          };
		  
		  
		 
		   $scope.EditpaymentDetails = function() {
			   if($scope.vendorpayDetails[0].chqdate)
				{
					var indianTimeZoneVal = ($scope.vendorpayDetails[0].chqdate).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj = new Date(indianTimeZoneVal);
					indainDateObj.setHours(indainDateObj.getHours() + 5);
					indainDateObj.setMinutes(indainDateObj.getMinutes() + 30);
					$scope.vendorpayDetails[0].chqdate = indainDateObj;
				}
				
			   $scope.vendorpayDetails[0].username = $scope.userid;
            $http({	  method: 'POST',
					url	: 'api/EditpaymentDetails/',
					data    : $scope.vendorpayDetails,
					 headers : {'Content-Type': 'application/json'}  
					}).success(function(data) {
						alert(data.message);
						$window.location.reload();
						});
					 
					};
  
			
			  
			
		  	$scope.Deletevendorpayment= function(id)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE',
               url: 'api/Deletevendorpayment/'+id,
               dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						$scope.ListvendorsPaymets();
		  });
				}
				else
				{}
			};
			
			$scope.DeleteSubPayment= function(id,poid)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE',
               url: 'api/DeleteSubPayment/'+id,
               dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						$scope.ListvendorsPaymets();
						$scope.GetVendorsPaymentsPoviseDetails(activeindex,poid);
		  });
				}
				else
				{}
			};
				
				
				
	
	/* Office */
			
			
			$scope.officeList= function()
			{
				$http({
              method: 'GET'
              , url: 'api/OfficeList/'
              , dataType: 'jsonp'
          }).then(function (response) {
				$scope.officeListing = response.data;	
				 $scope.currentPage = 0;
					$scope.pageSize = 5;
					if($scope.myValue > $scope.officeListing.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagesoffice = function () {
					return Math.ceil($scope.officeListing.length / $scope.pageSize);
    };
		  });
				
			};
			
			$scope.getofficeData= function(id)
			{
				$http({
              method: 'GET'
              , url: 'api/getOfficeData/'+id
              , dataType: 'jsonp'
          }).then(function (response) {
				$scope.officeDetails = response.data;	
				if($scope.officePaymentDetails)
				{
				$scope.officePaymentDetails[0].officevendor = $scope.officeDetails[0].officevendor;	
				$scope.officePaymentDetails[0].address = $scope.officeDetails[0].address;	
				$scope.officePaymentDetails[0].mobile = $scope.officeDetails[0].mobile;	
				$scope.officePaymentDetails[0].rent = $scope.officeDetails[0].rent;	
				}
		  });
				
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
						$scope.officeList();
		  });
				}
				else
				{}
			};
			
			$scope.AddNewoffice = function () {
		$http({
							    method  : 'POST',
								url     : 'api/AddNewoffice/',
								data    : $scope.office ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
							alert(data.message);
							$scope.officeList(); 
							$scope.office = null;
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
	
	
	/* Office Payment*/
			
			
			$scope.officePaymentList= function()
			{
				$http({
              method: 'GET'
              , url: 'api/OfficepaymentList/'+$scope.userlevel+'/'+$scope.userid
              , dataType: 'jsonp'
          }).then(function (response) {
				$scope.officePaymentListing = response.data;	
				 $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.officePaymentListing.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagesofficeRent = function () {
					return Math.ceil($scope.officePaymentListing.length / $scope.pageSize);
    };
		  });
				
			};
			
			$scope.getofficePaymentData= function(id)
			{
				$http({
              method: 'GET'
              , url: 'api/getofficePaymentData/'+id
              , dataType: 'jsonp'
          }).then(function (response) {
				$scope.officePaymentDetails = response.data;	
				$scope.officePaymentDetails[0].paymentmonth = new Date($scope.officePaymentDetails[0].paymentmonth);
				$scope.officePaymentDetails[0].paymentdate = new Date($scope.officePaymentDetails[0].paymentdate)
				$scope.officePaymentDetails[0].billdate = new Date($scope.officePaymentDetails[0].billdate)
		  });
				
			};
			
			$scope.DeleteOfficePayment= function(id)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/DeleteOfficePayment/'+id
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						$scope.officePaymentList();
		  });
				}
				else
				{}
			};
			
			$scope.AddOfficePayment = function () {
				$scope.officeDetails[0].createdby = $scope.userid;
				
				if($scope.officeDetails[0].monthodpayment)
				{
				var paymentmonth = ($scope.officeDetails[0].monthodpayment).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj1 = new Date(paymentmonth);
					indainDateObj1.setHours(indainDateObj1.getHours() + 5);
					indainDateObj1.setMinutes(indainDateObj1.getMinutes() + 30);
					$scope.officeDetails[0].monthodpayment = indainDateObj1;
				}
				
				if($scope.officeDetails[0].dateofpayment)
				{
					var paymentdate = ($scope.officeDetails[0].dateofpayment).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj = new Date(paymentdate);
					indainDateObj.setHours(indainDateObj.getHours() + 5);
					indainDateObj.setMinutes(indainDateObj.getMinutes() + 30);
					$scope.officeDetails[0].dateofpayment = indainDateObj;
				}
				if($scope.officeDetails[0].billdate)
				{
					var billdate = ($scope.officeDetails[0].billdate).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj2 = new Date(billdate);
					indainDateObj2.setHours(indainDateObj2.getHours() + 5);
					indainDateObj2.setMinutes(indainDateObj2.getMinutes() + 30);
					$scope.officeDetails[0].billdate = indainDateObj2;
				}
		$http({
							    method  : 'POST',
								url     : 'api/AddOfficePayment/',
								data    : $scope.officeDetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
							alert(data.message);
							location.reload();
					});
    };
			
			$scope.UpdateofficePaymentDetails = function () {
				
				if($scope.officePaymentDetails[0].paymentmonth)
				{
				var paymentmonth = ($scope.officePaymentDetails[0].paymentmonth).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj1 = new Date(paymentmonth);
					indainDateObj1.setHours(indainDateObj1.getHours() + 5);
					indainDateObj1.setMinutes(indainDateObj1.getMinutes() + 30);
					$scope.officePaymentDetails[0].paymentmonth = indainDateObj1;
				}
				if($scope.officePaymentDetails[0].paymentdate)
				{
					var paymentdate = ($scope.officePaymentDetails[0].paymentdate).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj = new Date(paymentdate);
					indainDateObj.setHours(indainDateObj.getHours() + 5);
					indainDateObj.setMinutes(indainDateObj.getMinutes() + 30);
					$scope.officePaymentDetails[0].paymentdate = indainDateObj;
				}
				if($scope.officePaymentDetails[0].billdate)
				{
					var billdate = ($scope.officePaymentDetails[0].billdate).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj2 = new Date(billdate);
					indainDateObj2.setHours(indainDateObj2.getHours() + 5);
					indainDateObj2.setMinutes(indainDateObj2.getMinutes() + 30);
					$scope.officePaymentDetails[0].billdate = indainDateObj2;
				}
		$http({
							    method  : 'POST',
								url     : 'api/UpdateofficePaymentDetails/',
								data    : $scope.officePaymentDetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
							alert(data.message);
							$scope.officePaymentList(); 
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
					$scope.numberOfPagesofstocksrn = function () {
					return Math.ceil($scope.StocksrnList.length / $scope.pageSize);
				};
				
				
				$scope.GenerateQrCode = function(i)
	{
			{
					$scope.StocksrnList[i].assignedfrom =$scope.userid;
					$http({
								method  : 'POST',
								url     : 'api/setQrValues/',
								data    : $scope.StocksrnList[i] ,
								headers : {'Content-Type': 'application/json'} 
				}).success(function(data) {
					if($scope.StocksrnList[i].zone != undefined)
					{
						$scope.StocksrnList[i].zonename = $filter('filter')($scope.AreaList, {id:$scope.StocksrnList[i].zone})[0].areaname
						
					}
					else
					{$scope.StocksrnList[i].zonename = ""}
					
					if($scope.StocksrnList[i].assignemp != undefined)
					{
						$scope.StocksrnList[i].assignuser = $filter('filter')($scope.userList, {id:$scope.StocksrnList[i].assignemp})[0].username
					}
					else
					{$scope.StocksrnList[i].assignuser = ""}
					
					
					
				 $scope.StocksrnList[i].barcodevalue = '_PO.: '+String($scope.StocksrnList[i].grid)+'_SrNo: '+String($scope.StocksrnList[i].srno)+'_AssignEmployee: '+String($scope.StocksrnList[i].assignuser)+'_Address: '+String($scope.StocksrnList[i].address)+'_Zone: '+String($scope.StocksrnList[i].zonename)+'_AssignDate: '+($scope.StocksrnList[i].assigndate1)
				
				
				
				$scope.qrcode[0].qrcodeString = $scope.StocksrnList[i].barcodevalue;
				$scope.qrcode[0].size = 75;
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
		
				
	
		  });
		 
	}
	}
				
				
		  });
				
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
              , url: 'api/getItemsIngr/'+grid+'/'+poid
              , dataType: 'jsonp'
          }).then(function (response) {
				$scope.ItemsInGR = response.data;	
		  });
				
			};
			
			$scope.itemsqtylength = [];
			
			$scope.getSeectedItemQty= function(productid,grid)
			{
				$scope.itemsqtylength1 = [];
				$http({
              method: 'GET'
              , url: 'api/getSeectedItemQty/'+productid+'/'+grid
              , dataType: 'jsonp'
          }).then(function (response) {
				$scope.ItemQty = response.data;	
				
				for(var i =0; i < $scope.ItemQty[0].qty;i++)
				{
					$scope.itemsqtylength1.push({'srno':''});
				}
				
				
				
		  });
				
				$scope.itemsqtylength.push($scope.itemsqtylength1)
				
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

$scope.yearsArray = [];
		var year = new Date().getFullYear();
		for(var i = 20 ; i > 0;i--)
		{
			$scope.yearsArray.push({'year':year - i})
		}
		
		for(var i = 0 ; i < 10;i++)
		{
			$scope.yearsArray.push({'year':year + i})
		}
				
		$scope.getOfficePaymentOnreport= function(year,office)
			{
				
				$http({
              method: 'GET'
              , url: 'api/getOfficePaymentOnreport/'+year+'/'+office
              , dataType: 'jsonp'
          }).then(function (response) {
						$scope.OfficerentReport = response.data;
		  });
				
			};		


			$scope.ListBillPayEntry= function()
			{
				
				$http({
              method: 'GET'
              , url: 'api/ListBillPayEntry/'
              , dataType: 'jsonp'
			  }).then(function (response) {
				$scope.BillPaymentList = response.data;

				$scope.currentPage = 0;
					$scope.pageSize = 7;
					if($scope.myValue > $scope.BillPaymentList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagesofficePayment = function () {
					return Math.ceil($scope.BillPaymentList.length / $scope.pageSize);
					}
			  });
				
			};		


			$scope.getMiscPaymentData= function(paymentid)
			{
				
				$http({
              method: 'GET'
              , url: 'api/getMiscPaymentData/'+paymentid
              , dataType: 'jsonp'
			  }).then(function (response) {
				$scope.PaymentsArray = response.data;
				$scope.getofficeData($scope.PaymentsArray[0].officeid);
				$scope.PaymentsArray.map((value)=>{
					value.paymentmonth = new Date(value.paymentmonth);
					value.paymentdate = new Date(value.paymentdate);
				});
			  });
				
			};			
			


//OFFICE MISC PAYMENTS

$scope.PaymentsArray = [{}];

$scope.AddNewNewEntry = function()
{
		var permit = $scope.PaymentsArray.filter(value =>{
				return !value.vendorname || !value.amount || !value.paymentdate || !value.paymentmonth
		});
		if(permit.length > 0)
		{
			$('.'+String($scope.PaymentsArray.length - 1)+'row').css('background','#F091A9');
		}
		else
		{
			$('.'+String($scope.PaymentsArray.length - 1)+'row').css('background','white');
			$scope.PaymentsArray.push({});
		}
};

$scope.RemoveEntry = function(index,paydetails)
{
	if(!paydetails.detailsid)
	{
		$scope.PaymentsArray.splice(index,1);
	}
	else
	{
		$http({
              method: 'DELETE'
              , url: 'api/RemoveBillPayEntry/'+paydetails.detailsid
              , dataType: 'jsonp'
          }).then(function (response) {
				if(response.data.status === 1)
				{
					$scope.getMiscPaymentData(paydetails.masterid);
				}
		  });	
	}
};

$scope.AddOfficeMiscPayments = function()
{
			$scope.PaymentsArray[0].createdby = $scope.userid;
				$http({
							    method  : 'POST',
								url     : 'api/AddOfficeMiscPayments/',
								data    : $scope.PaymentsArray,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						location.reload();
					});
};

			$scope.DeleteOfficeMiscPayment= function(paymentid)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/DeleteOfficeMiscPayment/'+paymentid
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						$scope.ListBillPayEntry();
		  });
				}
				else
				{}
			};
			



});