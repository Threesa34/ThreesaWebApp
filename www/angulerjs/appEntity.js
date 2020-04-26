
//NEW CONTROLLER__________
var appEntity = angular.module('appEntity', ['ngFileUpload', 'ui.bootstrap']).filter('startFrom', function () {
    return function (input, start) {
        start = +start;
       if(input!=undefined)
        {return input.slice(start);}
    }
}); 

appEntity.filter('unique', function() {
        return function(collection, primaryKey, secondaryKey) { //optional secondary key
          var output = [], 
              keys = [];

          angular.forEach(collection, function(item) {
                var key;
                secondaryKey === undefined ? key = item[primaryKey] : key = item[primaryKey][secondaryKey];

                if(keys.indexOf(key) === -1) {
                  keys.push(key);
                  output.push(item);
                }
          });

          return output;
        };
    });

appEntity.controller('MyCtrl', ['Upload', '$window', '$http', '$scope', function (Upload) {
	
	
    var vm = this;
	
	var insertedid;
	
	
	vm.UploadAadhar = function()
	{
		 if (vm.file) { 
		//check if from is valid
            vm.upload(vm.aadhar); 
		//call upload function
        } else {
            vm.file = {
                name: ""
            };
            vm.upload(vm.aadhar);
        }
    }
    vm.upload = function (aadhar) {
        Upload.upload({
            url: '/UploadAadhar', //webhttp://119.81.18.187:8003/api exposed to upload the file
            data: {
                id:insertedid,
                aadhar: aadhar
            } //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if (resp.data.error_code === 0) { //validate success
                alert(resp.data);
                /* location.reload(); */
            } else {
				 alert(resp.data);
				

            }
        });
	}
	
    vm.newEmployee = function () { //function to call on form submit 
	
		var userid = localStorage["userid"];
		
	
	if(vm.email == undefined)
	{
		email = "";
	}
	else
	{
		email = vm.email;
	}
	if(vm.salary == undefined)
	{
		salary = 0;
	}
	else
	{
		salary = vm.salary;
	}
	
	if(vm.mobile1 == undefined)
	{
		mobile1 = 0;
	}
	else
	{
		mobile1 = vm.mobile1;
	}
	if(vm.mobile2 == undefined)
	{
		mobile2 = 0;
	}
	else
	{
		mobile2 = vm.mobile2;
	}
	if(vm.dob == undefined)
	{
		dob = "";
	}
	else
	{
		var indianTimeZoneVal = (vm.dob).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj = new Date(indianTimeZoneVal);
					indainDateObj.setHours(indainDateObj.getHours() + 5);
					indainDateObj.setMinutes(indainDateObj.getMinutes() + 30);
					dob = indainDateObj;
	}
	if(vm.joindate == undefined)
	{
		joindate = "";
	}
	else
	{
		var indianTimeZoneVal = (vm.joindate).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj = new Date(indianTimeZoneVal);
					indainDateObj.setHours(indainDateObj.getHours() + 5);
					indainDateObj.setMinutes(indainDateObj.getMinutes() + 30);
					joindate = indainDateObj;
	}
	if(vm.userlevel == undefined)
	{
		var userlevel = ''
	}
	else
	{
		var userlevel = vm.userlevel
	}
	if(vm.supervisor == undefined)
	{
		var supervisor = 0
	}
	else
	{
		var supervisor = vm.supervisor
	}
	
	if(vm.username == undefined)
	{
		var username = ''
	}
	else
	{
		var username = vm.username
	}
	if(vm.password == undefined)
	{
		var password = ''
	}
	else
	{
		var password = vm.password
	}
        if (vm.file) { 
		//check if from is valid
            vm.upload(vm.name,vm.address,mobile1,mobile2,email,dob,joindate,salary,vm.photo,userlevel,supervisor,username,password,userid); 
		//call upload function
        } else {
            vm.file = {
                name: ""
            };
            vm.upload(vm.name,vm.address,mobile1,mobile2,email,dob,joindate,salary,vm.photo,userlevel,supervisor,username,password,userid);
        }
    }
    vm.upload = function (name,address,mobile1,mobile2,email,dob,joindate,salary,photo,userlevel,supervisor,username,password,userid) {
        Upload.upload({
            url: '/AddEmployee', // exposed to upload the file
            data: {
                name:name,
				address:address,
				mobile1:mobile1,
				mobile2:mobile2,
				email:email,
				dob:dob,
				joindate:joindate,
				salary:salary,
				photo:photo,
				userlevel:userlevel,
				supervisor:supervisor,
				username:username,
				password:password,
                userid: userid
            } //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
		console.log(resp);
            if (resp.data.error_code === 0) { //validate success
                alert(resp.data);
                 location.reload(); 
            } else {
				 alert(resp.data);
				 location.reload();
			}
        });
    };   
	
	
	
        vm.EditEmployee = function()
        {
			console.log(vm.employeedetails);
			
	if(vm.employeedetails[0].email == undefined)
	{
		email = "";
	}
	else
	{
		email = vm.employeedetails[0].email;
	}
	if(vm.employeedetails[0].salary == undefined)
	{
		salary = 0;
	}
	else
	{
		salary = vm.employeedetails[0].salary;
	}
	
	if(vm.employeedetails[0].mobile1 == undefined)
	{
		mobile1 = 0;
	}
	else
	{
		mobile1 = vm.employeedetails[0].mobile1;
	}
	if(vm.employeedetails[0].mobile2 == undefined)
	{
		mobile2 = 0;
	}
	else
	{
		mobile2 = vm.employeedetails[0].mobile2;
	}
	if(vm.employeedetails[0].dob == 'Invalid Date')
	{
		
		dob = "";
	}
	else
	{
		var indianTimeZoneVal = (vm.employeedetails[0].dob).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj = new Date(indianTimeZoneVal);
					indainDateObj.setHours(indainDateObj.getHours() + 5);
					indainDateObj.setMinutes(indainDateObj.getMinutes() + 30);
					dob = indainDateObj;
	}
	if(vm.employeedetails[0].joindate == 'Invalid Date')
	{
		joindate = "";
	}
	else
	{
var indianTimeZoneVal = (vm.employeedetails[0].joindate).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj = new Date(indianTimeZoneVal);
					indainDateObj.setHours(indainDateObj.getHours() + 5);
					indainDateObj.setMinutes(indainDateObj.getMinutes() + 30);
					joindate = indainDateObj;
	}
	if(vm.employeedetails[0].userlevel == undefined)
	{
		var userlevel = ''
	}
	else
	{
		var userlevel = vm.employeedetails[0].userlevel
	}
	if(vm.employeedetails[0].supervisor == undefined)
	{
		var supervisor = 0
	}
	else
	{
		var supervisor = vm.employeedetails[0].supervisor
	}
	
	if(vm.employeedetails[0].username == undefined)
	{
		var username = ''
	}
	else
	{
		var username = vm.employeedetails[0].username
	}
	if(vm.employeedetails[0].password == undefined)
	{
		var password = ''
	}
	else
	{
		var password = vm.employeedetails[0].password
	}
	
	   if (vm.photo) { 
		//check if from is valid
            vm.updateemp(vm.employeedetails[0].id,vm.employeedetails[0].name,vm.employeedetails[0].address,mobile1,mobile2,email,dob,joindate,salary,vm.photo,userlevel,supervisor,username,password); 
		//call upload function
        } else {
            
            vm.updateemp(vm.employeedetails[0].id,vm.employeedetails[0].name,vm.employeedetails[0].address,mobile1,mobile2,email,dob,joindate,salary,vm.employeedetails[0].photo,userlevel,supervisor,username,password);
        }
    }
    vm.updateemp = function (id,name,address,mobile1,mobile2,email,dob,joindate,salary,photo,userlevel,supervisor,username,password,userid) {
        Upload.upload({
            url: '/UpdateEmployee', // exposed to upload the file
            data: {
                id:id,
                name:name,
				address:address,
				mobile1:mobile1,
				mobile2:mobile2,
				email:email,
				dob:dob,
				joindate:joindate,
				salary:salary,
				photo:photo,
				userlevel:userlevel,
				supervisor:supervisor,
				username:username,
				password:password
            } //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
		console.log(resp);
            if (resp.data.error_code === 0) { //validate success
                alert(resp.data);
                 location.reload(); 
            } else {
				 alert(resp.data);
				 location.reload();
			}
        });
    }; 

	
	vm.AddNewProduct = function () { //function to call on form submit 
	
			vm.taxpercent = parseFloat(vm.cgst)+parseFloat(vm.sgst);
	
         if (vm.adv) { 
		  vm.uploadprd(vm.name,vm.pack,vm.weight,vm.unit,vm.description,vm.distrate,vm.retailerrate,vm.taxpercent,parseFloat(vm.cgst),parseFloat(vm.sgst),vm.mrp,vm.adv); 
        } 
		else
		{
			vm.adv = {
                name: ""
            };
            vm.uploadprd(vm.name,vm.pack,vm.weight,vm.unit,vm.description,vm.distrate,vm.retailerrate,vm.taxpercent,vm.cgst,vm.sgst,vm.mrp,vm.adv); 
			//call upload function
        }
		
    }
    vm.uploadprd = function (name,pack,weight,unit,description,distrate,retailerrate,taxpercent,cgst,sgst,mrp,adv) {
        Upload.upload({
            url: '/AddProduct', //webhttp://119.81.18.187:8003/api exposed to upload the file
            data: {
				 prdname : name,
				 pack :pack,
				 weight :weight,
				 unit :unit,
				 description : description,
				 distrate : distrate,
			   	 retailerrate :retailerrate,
			   	 taxpercent :taxpercent,
			   	 cgst :cgst,
			   	 sgst :sgst,
				 mrp :mrp,
				 adv : adv
            } //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if (resp.data.error_code === 0) { //validate success
                alert('Error ! Somthing went Wrong.');
                /* location.reload(); */
            } else {
				 alert('Data Inserted Successfully');
                 location.reload(); 
            }
        });
    };   
        vm.UpdateProductDetails = function()
        {
			
			vm.getProductDetails[0].taxpercent = parseFloat(vm.getProductDetails[0].cgst) + parseFloat(vm.getProductDetails[0].sgst);
             if (vm.adv) { //check if from is valid
            vm.uploadforproductsupdate(vm.getProductDetails[0].id,vm.getProductDetails[0].name,vm.getProductDetails[0].pack,vm.getProductDetails[0].weight,vm.getProductDetails[0].unit,vm.getProductDetails[0].description,vm.getProductDetails[0].distrate,vm.getProductDetails[0].retailerrate,vm.getProductDetails[0].taxpercent,parseFloat(vm.getProductDetails[0].cgst),parseFloat(vm.getProductDetails[0].sgst),vm.getProductDetails[0].mrp,vm.adv); 
			//call upload functionvm.membername,vm.memberid,vm.username
        } else {
            vm.adv = {
                name: vm.getProductDetails[0].adv
            };
            vm.uploadforproductsupdate(vm.getProductDetails[0].id,vm.getProductDetails[0].name,vm.getProductDetails[0].pack,vm.getProductDetails[0].weight,vm.getProductDetails[0].unit,vm.getProductDetails[0].description,vm.getProductDetails[0].distrate,vm.getProductDetails[0].retailerrate,vm.getProductDetails[0].taxpercent,parseFloat(vm.getProductDetails[0].cgst),parseFloat(vm.getProductDetails[0].sgst),vm.getProductDetails[0].mrp,vm.adv);
        }
        }
           vm.uploadforproductsupdate = function (id,name,pack,weight,unit,description,distrate,retailerrate,taxpercent,cgst,sgst,mrp,adv) {
        Upload.upload({
            url: 'http://119.81.18.187:8003/UpdateProducts', //webhttp://119.81.18.187:8003/api exposed to upload the file
            data: {
                id : id,
                name : name,
				pack : pack,
				weight : weight,
				unit : unit,
				description :description,
				distrate : distrate,
				retailerrate : retailerrate,
				taxpercent : taxpercent,
				cgst : cgst,
				sgst : sgst,
				mrp :mrp,
				adv :adv,
            } //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if (resp.data.error_code === 0) { //validate success
                alert('Error ! Somthing went Wrong.');
                /* location.reload(); */
            } else {
				alert('Template Updated Successfuly');
                 location.reload(); 
            }
        });
    }; 
	 
}]);
//-------------------------
appEntity.controller('entityController', function ($scope, $http, $window , $filter) {
        	$scope.username = $window.localStorage["username"];
			$scope.username=$scope.username.replace(/\"/g,""); 
			$scope.userid = $window.localStorage["userid"];
			$scope.userlevel = $window.localStorage["Userlevel"];
			$scope.userlevel = $scope.userlevel.replace(/\"/g,""); 
			$scope.supervisor = $window.localStorage["supervisor"];
			$scope.cartlength = 0;
			$scope.notificationcount = 0;
			
			
				var socket = io();
			
			
			$scope.monthsarr = [{'id':01,'monthname':'January'},{'id':02,'monthname':'February'},{'id':03,'monthname':'March'},{'id':04,'monthname':'April'},{'id':05,'monthname':'May'},{'id':06,'monthname':'June'},{'id':07,'monthname':'Jully'},{'id':08,'monthname':'August'},{'id':09,'monthname':'September'},{'id':10,'monthname':'October'},{'id':11,'monthname':'November'},{'id':12,'monthname':'December'}];
			
			$scope.getMonthname = function(monthid)
			{
				 return result = $filter('filter')($scope.monthsarr, {id:monthid})[0].monthname;
			}
			
			
			$scope.fromcurrentdate = new Date();
			
			
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
			
			
			
				 $scope.exportData = function (report) {
						$scope.pageSize=10;
					$scope.currentPage=0;
					 var blob = new Blob([document.getElementById('exportablenew').innerHTML], {
						  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" 
						 /* url: 'data:application/vnd.ms-excel;'  */
					   
					});
					saveAs(blob,report);
					$window.location.reload(); 
				};
						
			
			$scope.ListShifts = function()
			{
				$http({
              method: 'GET'
              , url: 'api/ListShifts/'+$scope.userid+'/'+$scope.userlevel
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.shiftList = response.data;
		  });
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
	  
			
			/* Customers */
			
			$scope.ListCustomersOnZone = function(zoneid)
			{
				$http({
              method: 'GET'
              , url: 'api/ListCustomersOnZone/'+zoneid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.CustomerList = response.data;
			  
					$scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.CustomerList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagescustomer = function () {
					return Math.ceil($scope.CustomerList.length / $scope.pageSize);
    };
			  
		  });
			};
			
			$scope.ListCustomers = function()
			{
				$http({
              method: 'GET'
              , url: 'api/ListCustomers/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.CustomerList = response.data;
			  
					$scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.CustomerList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagescustomer = function () {
					return Math.ceil($scope.CustomerList.length / $scope.pageSize);
    };
			  
		  });
			};
			
			$scope.setPage = function (pageNo) {
			 $scope.currentPage = pageNo;
				};
			 $scope.filter = function () {
			 $timeout(function () {
			 $scope.filteredItems = $scope.CustomerList.length;
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
		
		socket.on('NewCustomer', function(data){
							$scope.ListCustomers(); 
					});
			
			$scope.getCustomerData = function(customerid)
			{
				$http({
              method: 'GET'
              , url: 'api/getCustomerData/'+customerid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.CustomerDetails = response.data;
			  console.log($scope.CustomerDetails);
/* 			  $scope.upload.getcustdataUpdate = $scope.CustomerDetails; */
			  
		  });
			};

			$scope.AddNewcustomer = function()
			{
				$http({
							    method  : 'POST',
								url     : 'api/AddNewcustomer/',
								data    : $scope.customer ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						socket.emit('NewCustomer',$scope.customer);
						location.reload();
					});
			};
			
			$scope.UpdateCustomer = function()
			{
				$http({
							    method  : 'POST',
								url     : 'api/UpdateCustomer/',
								data    : $scope.CustomerDetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						location.reload();
					});
			};
			
			
			$scope.DeleteCustomer = function(customerid)
			{
				var yes = confirm('Are You Sure')
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/DeleteCustomer/'+customerid
              , dataType: 'jsonp'
          }).then(function (response) {
             alert(response.data.message);
			 	socket.emit('NewCustomer',$scope.customer);
			
		  });
				}
				else{}
			};
			$scope.checkrating = function(rate)
			{
				for( var i = 1; i <= rate; i++ ) {
					document.getElementById(i+""+i).style.color = "#ffd700";
					}
			}
			$scope.setReting = function(rate)
			{
				$scope.upload.rateing = rate;
				
				 for( var i = 1; i <= rate; i++ ) {
					document.getElementById(i).style.color = "#ffd700";
					}
					
			}
			
			$scope.setRetingedit = function(rate)
			{
				$scope.upload.getcustdataUpdate[0].rating = rate;
					for( var i = 1; i <= rate; i++ ) {
					document.getElementById(i+""+i).style.color = "#ffd700";
					}
			}
			
	
			$scope.UploadCustomers= function(CustomersDetails)
			
			{
				CustomersDetails[0].zoneid = $scope.selectedzoneid;
				CustomersDetails[0].createdby = $scope.userid;
				$http({
							    method  : 'POST',
								url     : 'api/UploadCustomers/',
								data    : CustomersDetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
							alert(data.message);
							socket.emit('NewCustomer',$scope.customer);
						
					});
			};	
			
			$scope.areacode= function(id)
			{
				
				$scope.areacodecustomer = id;
				console.log($scope.areacodecustomer)
			};	
	
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
			
			
		
			
			/* Products */
			
			
			
			
				$scope.ListProducts = function()
			{
				$http({
              method: 'GET'
              , url: 'api/ProductList/'
              , dataType: 'jsonp'
			}).then(function (response) {
              $scope.ProductList = response.data;
			  
			  $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.ProductList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.ProductList.length / $scope.pageSize);
    };
			  
			});
			};
			
			$scope.setPage = function (pageNo) {
			 $scope.currentPage = pageNo;
				};
			 $scope.filter = function () {
			 $timeout(function () {
			 $scope.filteredItems = $scope.ProductList.length;
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
			
			 $scope.addProducts= function() {
					$http({
							    method  : 'POST',
								url     : 'api/addProducts/',
								data    : $scope.product,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.upload.addProduct(data.insertId)
						
						$scope.product = null;
						
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
			  console.log($scope.productsDetails);
			  $scope.upload.getProductDetails = $scope.productsDetails;
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
			
			$scope.myfunction = function (data) {
        alert("---" + data);
    };
			
			$scope.UploadProducts= function(productsDetails)
			{
				$http({
							    method  : 'POST',
								url     : 'api/UpaloadProducts/',
								data    : productsDetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						 $scope.ListProducts(); 
					});
			};	
			
			
			
			
			
			

			
			
			
			
			
			
			/* ORDERS CAPTURE */
			
			$scope.ProductsArray = [{product:'',mrp:'',salerate:'0',qty:'',freeqty:'',amount:''}];

			$scope.editmrp = true;
		
	
			$scope.onSelectmrpNprd = function(productname,mrp,index,custtype)
			{
				$http({
              method: 'GET'
              , url: 'api/GetProductsalerate/'+productname+'/'+mrp+'/'+custtype
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.productssalesrate = response.data;
			  
			  $scope.ProductsArray[index].salerate = $scope.productssalesrate[0].salerate;
			  $scope.ProductsArray[index].taxpercent = $scope.productssalesrate[0].taxpercent;
			  $scope.ProductsArray[index].productid = $scope.productssalesrate[0].productid;
		  });
			};
		  
			
			
			
			
			$scope.checkstockBal = function(productname,mrp,index)
			{
				$http({
              method: 'GET'
              , url: 'api/StcokBalCheck/'+productname+'/'+mrp
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.StcokBalanceOfProduct = response.data;
			  console.log($scope.StcokBalanceOfProduct);
			  if($scope.ProductsArray[index] == undefined)
			  {
			  if($scope.StcokBalanceOfProduct[0].balqty < 100)
			  {
				  $scope.OrderDetails[index].balmessage = 'only '+$scope.StcokBalanceOfProduct[0].balqty+' items Remaining'
			  }
			  if($scope.StcokBalanceOfProduct[0].balqty <= 0)
			  {
				  $scope.OrderDetails[index].balmessage = 'Out of Stock'
			  }
			  }
			  else
			  {
			  if($scope.StcokBalanceOfProduct[0].balqty < 100)
			  {
				  $scope.ProductsArray[index].balmessage = 'only '+$scope.StcokBalanceOfProduct[0].balqty+' items Remaining'
			  }
			  if($scope.StcokBalanceOfProduct[0].balqty <= 0)
			  {
				  $scope.ProductsArray[index].balmessage = 'Out of Stock'
			  }
			  }
		  });
			};
			
			
			$scope.getDepoFororder = function(custtype)
			{
				$http({
              method: 'GET'
              , url: 'api/Depolist/'+custtype
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.Depolist = response.data;
		  });
			};
			
			
			$scope.setOrderfinalamount = function()
			{
				$scope.grossamount = 0;
				$scope.taxamount = 0;
				$scope.netamount = 0;
				$scope.totalqty = 0;
				for(var i = 0 ; i < $scope.ProductsArray.length;i++)
				{
					console.log($scope.ProductsArray[i].taxpercent+" , "+$scope.ProductsArray[i].amount+" , "+$scope.ProductsArray[i].qty);
					$scope.totalqty = $scope.totalqty + parseInt($scope.ProductsArray[i].qty);
					$scope.grossamount = $scope.grossamount + parseFloat($scope.ProductsArray[i].amount);
					$scope.taxamount = $scope.taxamount + (parseFloat($scope.ProductsArray[i].amount) * (parseFloat($scope.ProductsArray[i].taxpercent)/100));
				}
				$scope.netamount = $scope.grossamount + $scope.taxamount;
			};
			
			
			
				
			
				
				
				
				$scope.setPage = function (pageNo) {
			 $scope.currentPage = pageNo;
				};
			 $scope.filter = function () {
			 $timeout(function () {
			 $scope.filteredItems = $scope.OrderDetailsList.length;
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
				
				
				
				 $scope.setPage = function (pageNo) {
			 $scope.currentPage = pageNo;
				};
			 $scope.filter = function () {
			 $timeout(function () {
			 $scope.filteredItems = $scope.OrderDetailsList.length;
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
				
				
				
		
		 
			
			
			
			
			
			
			
			
			
			
			
			
			
			/* INVOICE */
			
			
		
			
			
			
			
			
			
			
			/* PLANS */
			
			
		
			
			
			
			
			
				$scope.AddNewPlan = function()
			{
				$http({
							    method  : 'POST',
								url     : 'api/AddNewPlan/',
								data    : $scope.plan,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						location.reload();
					});
			};		
			
			
			
			/* SALES RETURNHS */

			
			 $scope.SelectedProductsid = [];
  $scope.syncfordelete = function(bool, item){
    if(bool){
      // add item
	   if(item.length > 1)
	  {
		  for(var i = 0 ; i < item.length;i++)
		  {
			  $scope.SelectedProductsid.push(item[i]);
		  }
	  }
		  else
		  {
				$scope.SelectedProductsid.push(item);
		  }

	}
		else {
      // remove item
	  
	  for(var i=0 ; i < $scope.SelectedProductsid.length; i++) {
		  if(item.length  ==  $scope.ProductList.length)
		  {
				$scope.SelectedProductsid.splice(i,$scope.SelectedProductsid.length);
		  }
	  else
	  {
        if($scope.SelectedProductsid[i].id == item.id){
          $scope.SelectedProductsid.splice(i,1);
        }
	  }
	  }
	  
          
    }
	
  };

	  $scope.isCheckeddelete = function(product){
		
      var match = false;
      for(var i=0 ; i < $scope.SelectedProductsid.length; i++) {
		
					if($scope.SelectedProductsid[i].id == product.id){
					  match = true;
					}
		  
      }
      return match;
  };  
  
  $scope.syncforMaterialdelete = function(bool, item){
    if(bool){
      // add item
	   if(item.length > 1)
	  {
		  for(var i = 0 ; i < item.length;i++)
		  {
			  $scope.SelectedProductsid.push(item[i]);
		  }
	  }
		  else
		  {
				$scope.SelectedProductsid.push(item);
		  }

	}
		else {
      // remove item
	  
	  for(var i=0 ; i < $scope.SelectedProductsid.length; i++) {
		  if(item.length  ==  $scope.ItemsListing.length)
		  {
				$scope.SelectedProductsid.splice(i,$scope.SelectedProductsid.length);
		  }
	  else
	  {
        if($scope.SelectedProductsid[i].id == item.id){
          $scope.SelectedProductsid.splice(i,1);
        }
	  }
	  }
	  
          
    }
	
  };

	  $scope.isCheckedMaterialdelete = function(product){
		
      var match = false;
      for(var i=0 ; i < $scope.SelectedProductsid.length; i++) {
		
					if($scope.SelectedProductsid[i].id == product.id){
					  match = true;
					}
		  
      }
      return match;
  };  
  
  
  $scope.Selectedcustid = [];
  $scope.syncfordeletecust = function(bool, item){
    if(bool){
      // add item
	  if(item.length > 1)
	  {
		  for(var i = 0 ; i < item.length;i++)
		  {
			  $scope.Selectedcustid.push(item[i]);
		  }
	  }
		  else
		  {
				$scope.Selectedcustid.push(item);
		  }
	  
	}
		else {
      // remove item
	  
	  for(var i=0 ; i < $scope.Selectedcustid.length; i++) {
		  if(item.length  ==  $scope.CustomerList.length)
		  {
				$scope.Selectedcustid.splice(i,$scope.Selectedcustid.length);
		  }
	  else
	  {
        if($scope.Selectedcustid[i].id == item.id){
          $scope.Selectedcustid.splice(i,1);
        }
	  }         
    }
		}
  };

   $scope.isCheckeddeletecust = function(customers){
		
      var match = false;
      for(var i=0 ; i < $scope.Selectedcustid.length; i++) {
		
					if($scope.Selectedcustid[i].id == customers.id){
					  match = true;
					}
		  
      }
      return match;
  }; 
  
  $scope.LeavesApplications = [];
  
  $scope.syncfordeleteLeaves = function(bool,item){
    if(bool){
      // add item
	  if(item.length > 1)
	  {
		  for(var i = 0 ; i < item.length;i++)
		  {
			  $scope.LeavesApplications.push(item[i]);
		  }
	  }
		  else
		  {
				$scope.LeavesApplications.push(item);
		  }
	  
	}
		else {
      // remove item
	  for(var i=0 ; i < $scope.LeavesApplications.length; i++) {
		  if(item.length  ==  $scope.LeavesListing.length)
		  {
				$scope.LeavesApplications.splice(i,$scope.LeavesApplications.length);
		  }
	  else
	  {
        if($scope.LeavesApplications[i].id == item.id){
          $scope.LeavesApplications.splice(i,1);
        }
	  }         
    }
	
		}
  };

	 
  
  
  $scope.isCheckeddeleteLeaves = function(customers){
		
      var match = false;
      for(var i=0 ; i < $scope.LeavesApplications.length; i++) {
		
					if($scope.LeavesApplications[i].id == customers.id){
					  match = true;
					}
		  
      }
      return match;
  }; 
  
  $scope.syncfordeleteEnq = function(bool, item){
    if(bool){
      // add item
	  if(item.length > 1)
	  {
		  for(var i = 0 ; i < item.length;i++)
		  {
			  $scope.Selectedcustid.push(item[i]);
		  }
	  }
		  else
		  {
				$scope.Selectedcustid.push(item);
		  }
	  
	}
		else {
      // remove item
	  
	  for(var i=0 ; i < $scope.Selectedcustid.length; i++) {
		  if(item.length  ==  $scope.filterdEnquiries.length)
		  {
				$scope.Selectedcustid.splice(i,$scope.Selectedcustid.length);
		  }
	  else
	  {
        if($scope.Selectedcustid[i].id == item.id){
          $scope.Selectedcustid.splice(i,1);
        }
	  }         
    }
		}
  };

	  $scope.isCheckeddeleteEnq = function(customers){
		
      var match = false;
      for(var i=0 ; i < $scope.Selectedcustid.length; i++) {
		
					if($scope.Selectedcustid[i].id == customers.id){
					  match = true;
					}
		  
      }
      return match;
  };  
	
			$scope.DeleteSelectedProducts = function()
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
							    method  : 'POST',
								url     : 'api/DeleteSelectedProducts/',
								data    : $scope.SelectedProductsid ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						  location.reload();  
					});
				}
				else
				{location.reload(); }
			};	
			
			
			
			$scope.DeleteSelectedItems = function()
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
							    method  : 'POST',
								url     : 'api/DeleteSelectedItems/',
								data    : $scope.SelectedProductsid ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						  location.reload();  
					});
				}
				else
				{location.reload(); }
			};	
			
			
			
			
			$scope.DeleteSelectedCustomers = function()
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
							    method  : 'POST',
								url     : 'api/DeleteSelectedCustomers/',
								data    : $scope.Selectedcustid ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						  location.reload();  
					});
				}
				else
				{location.reload(); }
			};	
			
			
					/* Raw Material */
			
			
			$scope.ListRawProducts = function()
			{
				$http({
              method: 'GET'
              , url: 'api/rawProductList/'
              , dataType: 'jsonp'
			}).then(function (response) {
              $scope.RawProductList = response.data;
			  
			  $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.RawProductList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagesrawprd = function () {
					return Math.ceil($scope.RawProductList.length / $scope.pageSize);
    };
			});
			};
			
			$scope.addRawProducts= function() {
					$http({
							    method  : 'POST',
								url     : 'api/addRawProducts/',
								data    : $scope.product,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.product = null;
						$scope.ListRawProducts();
					});
				};
				
			$scope.editRawProduct= function() {
					$http({
							    method  : 'POST',
								url     : 'api/editRawProduct/',
								data    : $scope.productsDetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.ListRawProducts();
					});
				};
				
			$scope.getRawProductData = function(productid)
			{
				$http({
              method: 'GET'
              , url: 'api/getRawProductData/'+productid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.productsDetails = response.data;
		  });
			};
			
			
			$scope.DeleteRawProduct= function(productid)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/DeleteRawProduct/'+productid
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						$scope.ListRawProducts();
		  });
				}
				else
				{location.reload(); }
			};
			
			$scope.SelectedrawProductsid = [];
  $scope.syncforrawprddelete = function(bool, item){
    if(bool){
      // add item
	  if(item.length > 1)
	  {
		  for(var i = 0 ; i < item.length;i++)
		  {
			  $scope.SelectedrawProductsid.push(item[i]);
		  }
	  }
		  else
		  {
				$scope.SelectedrawProductsid.push(item);
		  }
	}
		else {
      // remove item
      for(var i=0 ; i < $scope.SelectedrawProductsid.length; i++) {
		  if(item.length  ==  $scope.RawProductList.length)
		  {
				$scope.SelectedrawProductsid.splice(i,$scope.SelectedrawProductsid.length);
		  }
	  else
	  {
        if($scope.SelectedrawProductsid[i].id == item.id){
          $scope.SelectedrawProductsid.splice(i,1);
        }
	  }
      }         
    }
  };

	  $scope.isCheckedrawprddelete = function(product){
		
      var match = false;
      for(var i=0 ; i < $scope.SelectedrawProductsid.length; i++) {
		
					if($scope.SelectedrawProductsid[i].id == product.id){
					  match = true;
					}
      }
	  
      return match;
  };  
  
			
			$scope.DeleteSelectedrawProducts = function()
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
							    method  : 'POST',
								url     : 'api/DeleteSelectedrawProducts/',
								data    : $scope.SelectedrawProductsid ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						  location.reload(); 
					});
				}
				else
				{location.reload(); }
			};	
			
			
			
			
			
			
			
			
		
			
			/* Material */
			
				$scope.ItemsList = function()
				{
			$http({
              method: 'GET'
              , url: 'api/ListItem/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.ItemsListing = response.data;
			  $scope.currentPage = 0;
					$scope.pageSize = 9;
					if($scope.myValue > $scope.ItemsListing.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.ItemsListing.length / $scope.pageSize);
					};
		  });
		};
		
		$scope.getItemData = function(itemid)
				{
			$http({
              method: 'GET'
              , url: 'api/getItemData/'+itemid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.ItemDetails = response.data;
			 
		  });
		};
			
			
			
			$scope.UpdateItemDetails= function()
			{
				$http({
							    method  : 'POST',
								url     : 'api/UpdateItemDetails/',
								data    : $scope.ItemDetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						 $scope.ItemsList(); 
					});
			};	
			
			
			$scope.AddNewItem= function()
			{
				$http({
							    method  : 'POST',
								url     : 'api/AddNewItem/',
								data    : $scope.material ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						 $scope.ItemsList(); 
					});
			};	
			
			$scope.UploadItems= function(productsDetails)
			{
				$http({
							    method  : 'POST',
								url     : 'api/UploadItems/',
								data    : productsDetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						 $scope.ItemsList(); 
					});
			};	
			
			
			
			/* enquiers */
			
			
			
				$scope.EnquiryList = function()
				{
			$http({
              method: 'GET'
              , url: 'api/EnquiryList/'+$scope.userid+'/'+$scope.userlevel
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.EnquiriesListing = response.data;
					$scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.EnquiriesListing.length)
					{
						$scope.myValue = 1;
					}
					
					
					 $scope.connections =[];
					 $scope.enquiries =[];
					for(var i = 0 ; i < $scope.EnquiriesListing.length ; i++)
					{
						if($scope.EnquiriesListing[i].conectionstats == '1')
						{
							$scope.connections.push($scope.EnquiriesListing[i]);
						}
						else
						{
							$scope.enquiries.push($scope.EnquiriesListing[i]);
						}
					}
					
					
					$scope.numberOfPageenquirypageinage = function() {
					return Math.ceil($scope.connections.length / $scope.pageSize);
					};
					
					$scope.numberOfPageenquirypending = function() {
					return Math.ceil($scope.enquiries.length / $scope.pageSize);
					};
					
					
					/* $scope.numberOfPageenquiry = function() {
					return Math.ceil($scope.EnquiriesListing.length / $scope.pageSize);
					}; */
		  });
		};
		
		$scope.getEnquiryData = function(enquiryid)
				{
			$http({
              method: 'GET'
              , url: 'api/getEnquiryData/'+enquiryid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.enquirydetails = response.data;
			  console.log($scope.enquirydetails);
			 /*  */
				$scope.enquirydetails[0].enqdate = new Date($scope.enquirydetails[0].enqdate);
				$scope.enquirydetails[0].atttime = new Date($scope.enquirydetails[0].atttime);
		  });
		};
			
			
			
			$scope.UpdateEnquiry= function()
			{
				
				if($scope.enquirydetails[0].enqdate != undefined)
				{
					var indianTimeZoneVal = ($scope.enquirydetails[0].enqdate).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj = new Date(indianTimeZoneVal);
					indainDateObj.setHours(indainDateObj.getHours() + 5);
					indainDateObj.setMinutes(indainDateObj.getMinutes() + 30);
					$scope.enquirydetails[0].enqdate = indainDateObj;
				}
				
			
					var indianTimeZoneVal1 = ($scope.enquirydetails[0].atttime).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj1 = new Date(indianTimeZoneVal1);
					indainDateObj1.setHours(indainDateObj1.getHours() + 5);
					indainDateObj1.setMinutes(indainDateObj1.getMinutes() + 30);
					$scope.enquirydetails[0].atttime = indainDateObj1;
				
				
				$http({
							    method  : 'POST',
								url     : 'api/UpdateEnquiry/',
								data    : $scope.enquirydetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						socket.emit('NewEnquiry',$scope.EnquiriesListing);
						 $scope.EnquiryList(); 
					});
			};	
			
					socket.on('NewEnquiry', function(data){
							$scope.EnquiryList(); 
					});
			
			
			$scope.AddNewEnquiry= function()
			{
				if($scope.customer.enqdate != undefined)
				{
					var indianTimeZoneVal = ($scope.customer.enqdate).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj = new Date(indianTimeZoneVal);
					indainDateObj.setHours(indainDateObj.getHours() + 5);
					indainDateObj.setMinutes(indainDateObj.getMinutes() + 30);
					$scope.customer.enqdate = indainDateObj;
				}
				
				if($scope.customer.atttime != undefined)
				{
					var indianTimeZoneVal1 = ($scope.customer.atttime).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj1 = new Date(indianTimeZoneVal1);
					indainDateObj1.setHours(indainDateObj1.getHours() + 5);
					indainDateObj1.setMinutes(indainDateObj1.getMinutes() + 30);
					$scope.customer.atttime = indainDateObj1;
				}
				$scope.customer.createdby = $scope.userid;
				
				$http({
							    method  : 'POST',
								url     : 'api/AddNewEnquiry/',
								data    : $scope.customer ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						socket.emit('NewEnquiry',$scope.EnquiriesListing);
						location.reload(); 
					});
			};	
			
			
			$scope.DeleteSelectedEnquiry= function()
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
							    method  : 'POST',
								url     : 'api/DeleteSelectedEnquiry/',
								data    : $scope.Selectedcustid ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						socket.emit('NewEnquiry',$scope.EnquiriesListing);
						 location.reload();
					});
					}
				else
				{location.reload(); }
			};	
			
			
			$scope.SendDetailsonWhatsapp = function(data)
			{
			
				var message = encodeURIComponent('Customer: '+data.customername+'\n Address: '+data.address+'\n Contact No.:'+data.mobile1+'\n Customer Comment: \n'+data.comment+'\n\n Referance:'+data.advname);
				
				 var whatsapp_url = "https://web.whatsapp.com://send?text=" + message;
				
				window.open(whatsapp_url, '_blank');
				
			}
			
			
				$scope.DeleteEnquiry= function(enquiryid)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/DeleteEnquiry/'+enquiryid
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						socket.emit('NewEnquiry',response.data.status);
						
		  });
				}
				else
				{location.reload(); }
			};
			
			$scope.converttoconnection = function(enquiryid)
				{
			$http({
              method: 'GET'
              , url: 'api/converttoconnection/'+enquiryid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.enquirydetails = response.data;
				$scope.enquirydetails[0].enqdate = new Date($scope.enquirydetails[0].enqdate);
				$scope.enquirydetails[0].atttime = new Date($scope.enquirydetails[0].atttime);
		  });
		};
		
		
		/* LEAVESA MANAGEMENT */
		
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
					$scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.LeavesListing.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPageenquiry = function() {
					return Math.ceil($scope.LeavesListing.length / $scope.pageSize);
					};
		  });
		};
		
		
		
		$scope.ApproveLeave = function(leaveid,id)
				{
				var reason = prompt("Please enter reason for review", " ");
			$http({
              method: 'GET'
              , url: 'api/ApproveLeave/'+leaveid+'/'+reason+'/'+id
              , dataType: 'jsonp'
          }).then(function (response) {
					alert(response.data.message);
					 socket.emit('LeaveEntry',$scope.leaves);
					$scope.LeavesList();
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
			
			
			
			$scope.SubmitLeave= function()
			{
				if($scope.leaves.fromdate != undefined)
				{
					var indianTimeZoneVal = ($scope.leaves.fromdate).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj = new Date(indianTimeZoneVal);
					indainDateObj.setHours(indainDateObj.getHours() + 5);
					indainDateObj.setMinutes(indainDateObj.getMinutes() + 30);
					$scope.leaves.fromdate = indainDateObj;
				}
				
				if($scope.leaves.todate != undefined)
				{
					var indianTimeZoneVal1 = ($scope.leaves.todate).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj1 = new Date(indianTimeZoneVal1);
					indainDateObj1.setHours(indainDateObj1.getHours() + 5);
					indainDateObj1.setMinutes(indainDateObj1.getMinutes() + 30);
					$scope.leaves.todate = indainDateObj1;
				}
				$scope.leaves.userid = $scope.userid;

				if($scope.leaves.reason == undefined)
					$scope.leaves.reason ='Religious Leave';
				
				if($scope.leaves.otherreason == undefined)
					$scope.leaves.otherreason ='';
				
				$http({
							    method  : 'POST',
								url     : 'api/SubmitLeave/',
								data    : $scope.leaves ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.leaves.username = $scope.username;
						 socket.emit('LeaveEntry',$scope.leaves);
						 location.reload();
						
					});
			};	
			
			
			$scope.DeleteSelectedApproval= function()
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
							    method  : 'POST',
								url     : 'api/DeleteSelectedApproval/',
								data    : $scope.LeavesApplications ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						 location.reload();
					});
					}
				else
				{location.reload(); }
			};	
			
				$scope.DeleteLeave= function(leaveid)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/DeleteLeave/'+leaveid
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						socket.emit('LeaveEntry',$scope.leaves);
		  });
				}
				else
				{location.reload(); }
			};
			
			
			
			
			
			//------------------complaints----------------------------------
			
			
			$scope.complaintList = function()
				{
			$http({
              method: 'GET'
              , url: 'api/complaintList/'+$scope.userid+'/'+$scope.userlevel
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.complaintlising = response.data;
           console.log($scope.complaintlising);
					$scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.complaintlising.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPageenquiry = function() {
					return Math.ceil($scope.complaintlising.length / $scope.pageSize);
					};
		  });
		};
			
			
			
			
				$scope.Selectedcomplaintsid = [];
  $scope.syncforcomplaintsdelete = function(bool, item){
    if(bool){
      // add item
	  if(item.length > 1)
	  {
		  for(var i = 0 ; i < item.length;i++)
		  {
			  $scope.Selectedcomplaintsid.push(item[i]);
		  }
	  }
		  else
		  {
				$scope.Selectedcomplaintsid.push(item);
		  }
	}
		else {
      // remove item
      for(var i=0 ; i < $scope.Selectedcomplaintsid.length; i++) {
		  if(item.length  ==  $scope.complaintlising.length)
		  {
				$scope.Selectedcomplaintsid.splice(i,$scope.Selectedcomplaintsid.length);
		  }
	  else
	  {
        if($scope.Selectedcomplaintsid[i].id == item.id){
          $scope.Selectedcomplaintsid.splice(i,1);
        }
	  }
      }         
    }
  };

	  $scope.isCheckedcomplaintsdelete = function(product){
		
      var match = false;
      for(var i=0 ; i < $scope.Selectedcomplaintsid.length; i++) {
		
					if($scope.Selectedcomplaintsid[i].id == product.id){
					  match = true;
					}
      }
	  
      return match;
  }; 
			
			
			
			$scope.getdatacollection = function(customer)
		
			{	
			   $scope.collection.customerid = customer.id;
			   $scope.collection.address = customer.address;
			   $scope.collection.mobile1 = customer.mobile1; 
		 
			}
			
				$scope.getdatacustomer = function(customer)
		
			{	
			   $scope.complaint.customerid = customer.id;
			   $scope.complaint.address = customer.address;
			   $scope.complaint.mobile1 = customer.mobile1; 
		 
			}
				$scope.DeleteSeletectedComplaints= function()
			{
				var yes = confirm('Are you Sure ?')
				if(yes)
				{
				$http({
							    method  : 'POST',
								url     : 'api/DeleteSeletectedComplaints/',
								data    : $scope.Selectedcomplaintsid ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						socket.emit('NewComplaint',$scope.complaint);
						location.reload();
					});
				}
				else
				{
					location.reload();
				}
			};	
			
			socket.on('NewComplaint', function(data){
							$scope.complaintList(); 
					});
			
			
			$scope.AddNewComplaints= function()
			{
				
				$scope.complaint.createdby = $scope.userid;
				
				$http({
							    method  : 'POST',
								url     : 'api/AddNewComplaints/',
								data    : $scope.complaint ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						socket.emit('NewComplaint',$scope.complaint);
						 location.reload();
					});
			};	
			
			
			$scope.UploadEmployee= function(employeedata)
			{
				
				employeedata[0].createdby = $scope.userid;
		
				$http({
							    method  : 'POST',
								url     : 'api/UploadEmployee/',
								data    : employeedata,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						 location.reload();
					});
			};	
			
			$scope.UpdateComplaint= function()
			{				
				$http({
							    method  : 'POST',
								url     : 'api/UpdateComplaint/',
								data    : $scope.complaintDetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.complaintList();
					});
			};	
			
			
			$scope.DeleteComplaint= function(complaintid)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/DeleteComplaint/'+complaintid
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						socket.emit('NewComplaint',complaintid);
		  });
				}
				else
				{location.reload(); }
			};
			
		
		$scope.getComplatedataData = function(complaintid)
				{
			$http({
              method: 'GET'
              , url: 'api/getComplatedataData/'+complaintid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.complaintDetails = response.data;				
		  });
		};
		
		/* EMPLOYEE  */
		
		$scope.userlevelarray = ['HO','OFFICE','FIELD','SUPERVISOR','STOCK MANAGER','SALES EXICUTIVE','ACCOUNT HEAD','COLLECTION MAN','SHOP MANAGEMENT'];
		
		
		$scope.getsupervisordetails = function (userlevel) {
          $http({
              method: 'GET'
              , url: 'api/userlevelcheck/'+userlevel
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.supervisordetailsarr = response.data;
          });
		  
      };
		
		$scope.ListEmployee = function()
				{
			$http({
              method: 'GET'
              , url: 'api/ListEmployee/'
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.employeeList = response.data;	
					
					$scope.currentPage = 0;
				$scope.pageSize = 50; 
					if($scope.myValue > $scope.employeeList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPageEmployee = function() {
					return Math.ceil($scope.employeeList.length / $scope.pageSize);
					};	

				$('[data-toggle="popover"]').popover();					
		  });
		};
		
		
					
			 $scope.SelectedEmployeeid = [];
  $scope.syncEmpfordelete = function(bool, item){
    if(bool){
      // add item
	   if(item.length > 1)
	  {
		  for(var i = 0 ; i < item.length;i++)
		  {
			  $scope.SelectedEmployeeid.push(item[i]);
		  }
	  }
		  else
		  {
				$scope.SelectedEmployeeid.push(item);
		  }

	}
		else {
      // remove item
	  
	  for(var i=0 ; i < $scope.SelectedEmployeeid.length; i++) {
		  if(item.length  ==  $scope.employeeList.length)
		  {
				$scope.SelectedEmployeeid.splice(i,$scope.SelectedEmployeeid.length);
		  }
	  else
	  {
        if($scope.SelectedEmployeeid[i].id == item.id){
          $scope.SelectedEmployeeid.splice(i,1);
        }
	  }
	  }
	  
          
    }
	console.log($scope.SelectedEmployeeid);
  };

	  $scope.isCheckedEmpfordelete = function(emp){
		
      var match = false;
      for(var i=0 ; i < $scope.SelectedEmployeeid.length; i++) {
		
					if($scope.SelectedEmployeeid[i].id == emp.id){
					  match = true;
					}
		  
      }
      return match;
  };  
		
		
		
		
		$scope.getEmployeeData = function(employeeid)
				{
			$http({
              method: 'GET'
              , url: 'api/getEmployeeData/'+employeeid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.employeedetails = response.data;	
			  console.log($scope.employeedetails);
			  $scope.employeedetails[0].dob = new Date($scope.employeedetails[0].dob);
			  $scope.employeedetails[0].joindate = new Date($scope.employeedetails[0].joindate);
				$scope.upload.employeedetails = $scope.employeedetails;	
		  });
		};
			
			$scope.DeleteEmployee = function(employeeid)
				{
					var yes = confirm('Are You Sure ?');
					if(yes)
					{
			$http({
              method: 'DELETE'
              , url: 'api/DeleteEmployee/'+employeeid
              , dataType: 'jsonp'
          }).then(function (response) {
              alert(response.data.message)
			  $scope.ListEmployee();
		  });
					}
					
		};
			
		$scope.salarydata = null;
		
			$scope.getemployeesalary = function(month)
				{
					
					var dd = month.getDate();
					if(dd < 10)
						dd = '0'+dd;
					var mm = month.getMonth()+1;
					if(mm < 10)
						mm = '0'+mm;
					var yyyy = month.getFullYear();
					
					$scope.month = yyyy+'-'+mm+'-'+dd;
					
			$http({
              method: 'GET'
              , url: 'api/getemployeesalary/'+$scope.month
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.employeesalarydetails = response.data;
			  console.log($scope.employeesalarydetails)
			  $scope.currentPage = 0;
					$scope.pageSize = 50;
					if($scope.myValue > $scope.employeesalarydetails.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.employeesalarydetails.length / $scope.pageSize);
		};
			  
			  $scope.salarydata = $scope.employeesalarydetails;
		  });
		};
		
		var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

		
		function inWords (num) {
			 if(Number.isInteger(num) == false)
			 {
				 var no = num.toString().split(".")[1]
				 if(no < 10)
					 no = no+'0';
				 num = parseInt(num)
				  if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
	console.log(n)
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + '' : '';

	if ((no = no.toString()).length > 9) return 'overflow';
    n1 = ('000000000' + no).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n1) return; var str1 = '';
    str1 += (n1[1] != 0) ? (a[Number(n1[1])] || b[n1[1][0]] + ' ' + a[n1[1][1]]) + 'crore ' : '';
    str1 += (n1[2] != 0) ? (a[Number(n1[2])] || b[n1[2][0]] + ' ' + a[n1[2][1]]) + 'lakh ' : '';
    str1 += (n1[3] != 0) ? (a[Number(n1[3])] || b[n1[3][0]] + ' ' + a[n1[3][1]]) + 'thousand ' : '';
    str1 += (n1[4] != 0) ? (a[Number(n1[4])] || b[n1[4][0]] + ' ' + a[n1[4][1]]) + 'hundred ' : '';
    str1 += (n1[5] != 0) ? ((str1 != '') ? 'and ' : '') + (a[Number(n1[5])] || b[n1[5][0]] + ' ' + a[n1[5][1]]) + '' : '';
    return str+' And '+str1+' Paisas Only';
				 
			}
				else
				{
					 if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + '' : '';
	
	return str+' Rupees Only'
	
				}
   
}
		
		$scope.getSalarydataData = function(selectedmonth,userid)
		{
			 /* var result = $filter('filter')($scope.salarydata, {id:userid}); */
			 if(selectedmonth == undefined)
			 
				 var month = $scope.fromcurrentdate;
			 
			 else
				  var month = selectedmonth;
					var dd = month.getDate();
					if(dd < 10)
						dd = '0'+dd;
					var mm = month.getMonth()+1;
					if(mm < 10)
						mm = '0'+mm;
					var yyyy = month.getFullYear();
					
					$scope.month = yyyy+'-'+mm+'-'+dd;
					
			 	$http({
              method: 'GET'
              , url: 'api/getemployeesalaryOnemployee/'+userid+'/'+$scope.month
              , dataType: 'jsonp'
          }).then(function (response) {
			   $scope.SalaryDetails = response.data;
			   console.log($scope.SalaryDetails);
			   $scope.expense = parseFloat($scope.SalaryDetails[0].mobile_exp) + parseFloat($scope.SalaryDetails[0].other_exp) + parseFloat($scope.SalaryDetails[0].travel_exp);
			 $scope.totalsal = parseFloat($scope.SalaryDetails[0].totalsal) + parseFloat( $scope.expense) - (parseFloat($scope.SalaryDetails[0].payamt) + parseFloat($scope.SalaryDetails[0].loaninst));
				$scope.amtinstr = inWords(parseFloat($scope.totalsal));
		  });
			 
			
		};	
		
		
		
		/* LOAN MANAGEMNET */
			
			
			
			
			$scope.ListLoan = function()
				{
			$http({
              method: 'GET'
              , url: 'api/ListLoan/'+$scope.userid+'/'+$scope.userlevel
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.LoanList = response.data;	
			  
			  	$scope.totalLoanAmount = $scope.LoanList.reduce((sum,value)=>{
						return sum+value.loanamt;
					},0);
			   $scope.currentPage = 0;
					$scope.pageSize = 20;
					if($scope.myValue > $scope.LoanList.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagesForLoan = function () {
					return Math.ceil($scope.LoanList.length / $scope.pageSize);
    };
	
	
			
	
		  });
		};
		
		
		
		
		$scope.getTotalLoanAmount = function()
		{
					if($scope.searchedLoanList)
					{
						$scope.totalLoanAmount = $scope.searchedLoanList.reduce((sum,value)=>{
							return sum+value.loanamt;
						},0);
					}
					else
					{
						$scope.totalLoanAmount = $scope.LoanList.reduce((sum,value)=>{
						return sum+value.loanamt;
						},0);
					}
		};
		
		$scope.getTotalLoanPaidAmount = function()
		{
				if($scope.searchedLoanPaymentList)
				{
					$scope.totalLoanPaidAmount = $scope.searchedLoanPaymentList.reduce((sum,value)=>{
						return sum+value.paidamount;
					},0);
					
					$scope.ActualLoanAmount = $scope.searchedLoanPaymentList.reduce((sum,value)=>{
							return sum+value.loanamt;
						},0);
					
				}
				else
				{
					$scope.totalLoanPaidAmount = $scope.loanPaymentsDetails.reduce((sum,value)=>{
						return sum+value.paidamount;
					},0);
					
					$scope.ActualLoanAmount = $scope.loanPaymentsDetails.reduce((sum,value)=>{
							return sum+value.loanamt;
						},0);
				}
				
		};
		
		$scope.ResetTotal = function()
		{
					if($scope.loanPaymentsDetails)
					{
						$scope.totalLoanPaidAmount = $scope.loanPaymentsDetails.reduce((sum,value)=>{
							return sum+value.paidamount;
						},0);
					}
					else
					{
						$scope.totalLoanAmount = $scope.LoanList.reduce((sum,value)=>{
						return sum+value.loanamt;
						},0);
					}
		};

		
		
		$scope.getLoanData = function(loanid)
				{
			$http({
              method: 'GET'
              , url: 'api/getLoanData/'+loanid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.loan = response.data;	
			  $scope.loan[0].instmonth = new Date($scope.loan[0].instmonth);
		  });
		};
		
		$scope.DeleteLoanData = function(loanid)
				{
					var yes =confirm('Are You Sure ?')
					if(yes)
					{
			$http({
              method: 'DELETE'
              , url: 'api/DeleteLoanData/'+loanid
              , dataType: 'jsonp'
          }).then(function (response) {
             alert(response.data.message);
			 $scope.ListLoan();
		  });
					}
		};
			
			$scope.SaveLoandetails= function()
			{		
				$scope.loan[0].createdby = $scope.userid;		

				var indianTimeZoneVal = ($scope.loan[0].instmonth).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
					var indainDateObj = new Date(indianTimeZoneVal);
					indainDateObj.setHours(indainDateObj.getHours() + 5);
					indainDateObj.setMinutes(indainDateObj.getMinutes() + 30);
					 $scope.loan[0].instmonth = indainDateObj;				
				$http({
							    method  : 'POST',
								url     : 'api/SaveLoandetails/',
								data    : $scope.loan ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.loan  = undefined;
						$scope.ListLoan();
					});
			};	
			
			
			/* -----Set Shift */
			$scope.setShiftTime= function(shiftid)
			{		
			if($scope.SelectedEmployeeid.length > 0)
			{
			$scope.SelectedEmployeeid[0].shiftid = shiftid;
				$http({
							    method  : 'POST',
								url     : 'api/setShiftTime/',
								data    : $scope.SelectedEmployeeid,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						location.reload();
					});
			}
			else
			{
				alert("Please Select Employee First And try Again.");
			}
			};	
			
			$scope.getShiftData = function(id)
			{
				$http({
              method: 'GET'
              , url: 'api/getShiftData/'+id
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.shiftdata = response.data;
		
		  });
			};
			
			
			$scope.DeletedbulkEmployee= function()
			{		
			if($scope.SelectedEmployeeid.length > 0)
			{
				var yes = confirm('Are You Sure ?');
				if(yes)
				{
				$http({
							    method  : 'POST',
								url     : 'api/DeletedbulkEmployee/',
								data    : $scope.SelectedEmployeeid,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						location.reload();
					});
				}
					}
			else
			{
				alert("Please Select Employee First And try Again.");
			}
			};	
			
		/* EXPENSE MANAGEMNET */
			
			
			$scope.ListExpense = function()
				{
			$http({
              method: 'GET'
              , url: 'api/ListExpense/'+$scope.userid+'/'+$scope.userlevel
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.Expenselist = response.data;	
			   $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.Expenselist.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagesForExpense = function () {
					return Math.ceil($scope.Expenselist.length / $scope.pageSize);
    };
		  });
		};
		
		$scope.getExpenseData = function(id)
				{
			$http({
              method: 'GET'
              , url: 'api/getExpenseData/'+id
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.expense = response.data;	
			 
		  });
				};
				
				
		  $scope.resetFile = function(filetype,empid)
				{
			$http({
              method: 'GET'
              , url: 'api/resetFile/'+filetype+'/'+empid
              , dataType: 'jsonp'
          }).then(function (response) {
            $scope.getEmployeeData(empid);
			 
		  });
		};
		
		$scope.DeleteExpenseData = function(id)
				{
					var yes =confirm('Are You Sure ?')
					if(yes)
					{
			$http({
              method: 'DELETE'
              , url: 'api/DeleteExpenseData/'+id
              , dataType: 'jsonp'
          }).then(function (response) {
             alert(response.data.message);
			 $scope.ListExpense();
		  });
					}
		};
			
			$scope.Expenseadd = function()
			{		
				$scope.expense.createdby = $scope.userid;		

						
				$http({
							    method  : 'POST',
								url     : 'api/addexpense/',
								data    : $scope.expense ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.expense = null;
						$scope.ListExpense();
					});
			};
			
		 $scope.Setenquiryreviw = function(id)
			{
				 var review_enq = prompt("Please enter reson for review", " ");
					$http({
              method: 'GET'
              , url: 'api/Setenquiryreviw/'+id+'/'+$scope.userid+'/'+review_enq
              , dataType: 'jsonp'
          }).then(function (response) {
              alert(response.data.message)
		  });
			};
			
		
		
		
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
		
		
			/* 
			  push notification
			AIzaSyDygPE5GBTBmz-7ijF619PlybOM_Cb886I     --- api key


threesattendanceapplication ---------------application id */


			
			//------------------Collection----------------------------------
			
			
						

			 
			$scope.ListZonesAssignforUserReciept = function()
				{
			$http({
              method: 'GET'
              , url: 'api/ListZonesAssignforUserReciept/'+$scope.userid+'/'+$scope.userlevel
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.Zonelist = response.data;
          
		  });
		};
		
		$scope.collectionList = function()
				{
			$http({
              method: 'GET'
              , url: 'api/collectionList/'+$scope.userid+'/'+$scope.userlevel
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.collectionListing = response.data;
          
					$scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.collectionListing.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagecollection = function() {
					return Math.ceil($scope.collectionListing.length / $scope.pageSize);
					};
		  });
		};
			
			
			
					socket.on('NewCollection', function(data){
						$scope.collectionList();
					});
					
			
			$scope.AddNewCollection= function()
			{
				
				$scope.collection.createdby = $scope.userid;
				$scope.collection.zoneid = $scope.collection.zoneid.zoneid;
				$scope.collection.receiptno = $scope.RecieptIdOnZone[0].receiptno;
				
				$http({
							    method  : 'POST',
								url     : 'api/AddNewCollection/',
								data    : $scope.collection ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						socket.emit('NewCollection',$scope.collection);
						 location.reload();
					});
					
			};
			
			$scope.sendreceipt = function(id) { 
				$http(
					{
						method: 'GET',
						url: '/api/customerget/'+id,
						dataType: 'jsonp'
					 }
					)
					.then(function(response){ 
					$scope.getcustomerdata = response.data;
					 
			  });
   
			};
			
			$scope.GetLastRecieptOnZone = function(zoneid) { 
				$http(
					{
						method: 'GET',
						url: '/api/GetLastRecieptOnZone/'+zoneid,
						dataType: 'jsonp'
					 }
					)
					.then(function(response){ 
					$scope.RecieptIdOnZone = response.data;
					if($scope.RecieptIdOnZone[0].bookno == 'No Book Allocate for this Zone.')
					{
						document.getElementById('sbtbtn').disabled = true;
					}
					else
					{
					 $scope.RecieptIdOnZone[0].receiptno = parseInt($scope.RecieptIdOnZone[0].receiptno) + 1;
					 document.getElementById('sbtbtn').disabled = false;
					}
			  });
			  
			  $scope.ListCustomersOnZone(zoneid);
   
			};
			
			
			
				$scope.Selectedcollectionid = [];
  $scope.syncforcollectionsdelete = function(bool, item){
    if(bool){
      // add item
	  if(item.length > 1)
	  {
		  for(var i = 0 ; i < item.length;i++)
		  {
			  $scope.Selectedcollectionid.push(item[i]);
		  }
	  }
		  else
		  {
				$scope.Selectedcollectionid.push(item);
		  }
	}
		else {
      // remove item
      for(var i=0 ; i < $scope.Selectedcollectionid.length; i++) {
		  if(item.length  ==  $scope.collectionListing.length)
		  {
				$scope.Selectedcollectionid.splice(i,$scope.Selectedcollectionid.length);
		  }
	  else
	  {
        if($scope.Selectedcollectionid[i].id == item.id){
          $scope.Selectedcollectionid.splice(i,1);
        }
	  }
      }         
    }
  };

	  $scope.isCheckedcolldelete = function(product){
		
      var match = false;
      for(var i=0 ; i < $scope.Selectedcollectionid.length; i++) {
		
					if($scope.Selectedcollectionid[i].id == product.id){
					  match = true;
					}
      }
	  
      return match;
  }; 
			
			
			
		
				$scope.DeleteSeletectedCollection= function()
			{
				var yes = confirm('Are you Sure ?')
				if(yes)
				{
				$http({
							    method  : 'POST',
								url     : 'api/DeleteSeletectedCollection/',
								data    : $scope.Selectedcollectionid ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						socket.emit('NewComplaint',$scope.collection);
						location.reload();
					});
				}
				else
				{
					location.reload();
				}
			};	
			
			socket.on('NewComplaint', function(data){
							$scope.collectionList(); 
					});
			
			
		
			
			
			
			
			$scope.UpdateCollection= function()
			{				
				$http({
							    method  : 'POST',
								url     : 'api/UpdateCollection/',
								data    : $scope.collectionDetails ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.collectionList();
					});
			};	
			
			
			$scope.DeleteCollection= function(collectionid)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/DeleteCollection/'+collectionid
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						socket.emit('NewComplaint',collectionid);
		  });
				}
				else
				{location.reload(); }
			};
			
		
		$scope.getCollectiondataData = function(collectionid)
				{
			$http({
              method: 'GET'
              , url: 'api/getCollectiondataData/'+collectionid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.collectionDetails = response.data;
			  console.log($scope.collectionDetails);
		  });
		};
		
		
		$scope.CheckEmpExistInExpence = function(empid)
				{
			$http({
              method: 'GET'
              , url: 'api/CheckEmpExistInExpence/'+empid
              , dataType: 'jsonp'
          }).then(function (response) {
              alert(response.data.message);
			  $('#submitexp').prop('disabled', true);
		  });
		};
		
		
		$scope.getEmployesLoanPaymentDetails = function(empid)
				{
			$http({
              method: 'GET'
              , url: 'api/getEmployesLoanPaymentDetails/'+empid
              , dataType: 'jsonp'
          }).then(function (response) {
				$scope.loanPaymentsDetails = response.data;
			  
			  console.log($scope.loanPaymentsDetails);
			   $scope.currentPage = 0;
					$scope.pageSize = 20;
					if($scope.myValue > $scope.loanPaymentsDetails.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagesForLoanPayment = function () {
					return Math.ceil($scope.loanPaymentsDetails.length / $scope.pageSize);
    };
			  
					$scope.totalLoanPaidAmount = $scope.loanPaymentsDetails.reduce((sum,value)=>{
						return sum+value.paidamount;
					},0);
					
					$scope.ActualLoanAmount = $scope.loanPaymentsDetails[0].actualLoanAmount
		  });
		};
		
		
		
		$scope.LisBookDetails = function()
				{
			$http({
              method: 'GET'
              , url: 'api/LisBookDetails/'+$scope.userlevel+'/'+$scope.userid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.Listbookdata = response.data;
			  
			  $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.Listbookdata.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagebook = function() {
					return Math.ceil($scope.Listbookdata.length / $scope.pageSize);
					};
		  });
		};
		
		$scope.SaveReceiptbookData= function()
			{				
					$scope.bookdata[0].createdby = $scope.userid 
					$scope.bookdata[0].userid = $scope.bookdata[0].user.id; 
				$http({
							    method  : 'POST',
								url     : 'api/SaveReceiptbookData/',
								data    : $scope.bookdata ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.bookdata = [];
						$scope.LisBookDetails();
					});
			};	
			
			
			$scope.DeleteBookRecord= function(bookid)
			{
				var yes = confirm("Are You Sure?");
				if(yes)
				{
				$http({
              method: 'DELETE'
              , url: 'api/DeleteBookRecord/'+bookid
              , dataType: 'jsonp'
          }).then(function (response) {
						alert(response.data.message);
						$scope.LisBookDetails();
		  });
				}
				
			};
			
		
		$scope.getBookDetails = function(bookid)
				{
			$http({
              method: 'GET'
              , url: 'api/getBookDetails/'+bookid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.bookdata = response.data;
		  });
		};
		
		
		$scope.GetAdvertisementDetails = function(advid)
				{
			$http({
              method: 'GET'
              , url: 'api/GetAdvertisementDetails/'+advid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.AdvDetails = response.data;
		  });
		};
		
		
		$scope.getBookNoOnZoneanduser = function(zoneid,userid)
				{
			$http({
              method: 'GET'
              , url: 'api/getBookNoOnZoneanduser/'+zoneid+'/'+userid
              , dataType: 'jsonp'
          }).then(function (response) {
					$scope.CollectionBooks = response.data;
					console.log($scope.CollectionBooks);
		  });
		};
		
		$scope.GetCollectionInzone = function(zoneid,userid)
				{
			$http({
              method: 'GET'
              , url: 'api/GetCollectionInzone/'+zoneid+'/'+userid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.CollectionRecord = response.data;
			  
			   $scope.Paginationoptionsarr =  [{'show':'10','act':'10'},{'show':'25','act':'25'},{'show':'50','act':'50'},{'show':'100','act':'100'},{'show':'All','act':$scope.CollectionRecord.length}];
			   $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.CollectionRecord.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagecollreport = function() {
					return Math.ceil($scope.CollectionRecord.length / $scope.pageSize);
					};
					$scope.getBookNoOnZoneanduser(zoneid,userid)
		  });
		};
		
		
		
		
			  
		$scope.GetStocusedInzone = function(zoneid,userid)
				{
			$http({
              method: 'GET'
              , url: 'api/GetStocusedInzone/'+zoneid+'/'+userid
              , dataType: 'jsonp'
          }).then(function (response) {
              $scope.UsedStockRecord = response.data;
			  
			 $scope.Paginationoptionsarr =  [{'show':'10','act':'10'},{'show':'25','act':'25'},{'show':'50','act':'50'},{'show':'100','act':'100'},{'show':'All','act':$scope.UsedStockRecord.length}];
			   $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.UsedStockRecord.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPageusedstockreport = function() {
					return Math.ceil($scope.UsedStockRecord.length / $scope.pageSize);
					};
					$scope.getBookNoOnZoneanduser(zoneid,userid)
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
				
			
				
							}
					});	
		
		
		// LOAN PAYMENTS DETAILS
		
		
		$scope.ListLoanPayments = function()
		{
			$http({
              method: 'GET'
              , url: 'api/ListLoanPayments/'
              , dataType: 'jsonp'
          }).then(function (response) {
			  $scope.loanPaymentsDetails = response.data;
			  
			   $scope.currentPage = 0;
					$scope.pageSize = 20;
					if($scope.myValue > $scope.loanPaymentsDetails.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPagesForLoanPayment = function () {
					return Math.ceil($scope.loanPaymentsDetails.length / $scope.pageSize);
    };
			  
				$scope.totalLoanPaidAmount = $scope.loanPaymentsDetails.reduce((sum,value)=>{
						return sum+value.paidamount;
					},0);
					// $scope.ActualLoanAmount = $scope.loanPaymentsDetails.reduce((sum,value)=>{
							// return sum+value.loanamt;
						// },0);
		  });
		};
		
		$scope.getEmployesLoanDetails = function(userid)
		{
			$http({
              method: 'GET'
              , url: 'api/getEmployesLoanDetails/'+userid
              , dataType: 'jsonp'
          }).then(function (response) {
			  $scope.loanentries = response.data;
		  });
		};
		
		$scope.getLoanPaymentData = function(paymentid)
		{
			$http({
              method: 'GET'
              , url: 'api/getLoanPaymentData/'+paymentid
              , dataType: 'jsonp'
          }).then(function (response) {
			  $scope.loan = response.data;
			  $scope.loan[0].paymonth = new Date($scope.loan[0].paymonth);
		  });
		};
		
		$scope.DeleteLoanPaymentData = function(paymentid)
		{
			var yes  = confirm('Record will peremanently deleted from system, \n Do you want to delete it?');
			if(yes)
			{
			$http({
              method: 'DELETE'
              , url: 'api/DeleteLoanPaymentData/'+paymentid
              , dataType: 'jsonp'
          }).then(function (response) {
			  alert(response.data.message);
			  $scope.ListLoanPayments();
		  });
			}
		};
		
		$scope.SaveLoanPaymentdetails = function()
		{
						$scope.loan[0].createdby = $scope.userid;
			$http({
							    method  : 'POST',
								url     : 'api/SaveLoanPaymentdetails/',
								data    : $scope.loan[0],
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						$scope.ListLoanPayments();
					});
		}
		
		

		// ATTENDANCE REPORT


		$scope.MonthsArr = [
			{
				monthno : '01',
				monthname : 'January'
			},
			{
				monthno : '02',
				monthname : 'February'
			},
			{
				monthno : '03',
				monthname : 'March'
			},
			{
				monthno : '04',
				monthname : 'April'
			},
			{
				monthno : '05',
				monthname : 'May'
			},
			{
				monthno : '06',
				monthname : 'June'
			},
			{
				monthno : '07',
				monthname : 'July'
			},
			{
				monthno : '08',
				monthname : 'August'
			},
			{
				monthno : '09',
				monthname : 'Septembar'
			},
			{
				monthno : '10',
				monthname : 'October'
			},
			{
				monthno : '11',
				monthname : 'November'
			},
			{
				monthno : '12',
				monthname : 'December'
			}
		]

		$scope.getEmployeeAttendanceReport = function(selectedMonth, selectedUser)
		{
			if(selectedMonth)
			{
				
				var attMonth = selectedMonth+'-'+new Date().getFullYear();
			}
			else
			{
				var month = parseInt(new Date().getMonth()+1);
				if(month < 10)
				{
					var mm = '0'+month;
				}
				else
				{
					var mm = month;
				}
				//month = parseInt(month);
				var attMonth = mm+'-'+new Date().getFullYear();
			}
			if(selectedUser)
			{
				$http({
					method  : 'POST',
					url     : 'api/getEmployeeAttendanceReport/',
					data    : {selectedUser: selectedUser, selectedMonth: attMonth},
					headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						$scope.employeeAttendaceReportList = data;
					});
	
			}
			else
			{
				alert('Please select employee for get attendance report of selected user');
			}

			
		}





		//ARTTENDANCE REPORT
		
		
		
			
});
