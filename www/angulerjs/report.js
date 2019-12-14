var reportApp = angular.module('reportApp', ['ui.bootstrap']).filter('startFrom', function() {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
}); 
  reportApp.controller('reportController', function($scope, $http,$window,$rootScope,$sce) {
	 
	 
	 
	 
	 
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
	 
	 $scope.orderreport=function(){
		 $http(
		{
            method: 'GET',
            url: 'api/allorderreport/',
            dataType: 'jsonp'
         }
	)
  .then(function(response){ 
  $scope.ordersreport= response.data;
   console.log( $scope.ordersreport);
    $scope.myordersreport=$scope.ordersreport;
	
	var myprevidmaha = $scope.myordersreport[0].ordid;
   for(var i=1;i<$scope.ordersreport.length;i++){
	   
   if(myprevidmaha == $scope.myordersreport[i].ordid){
		  $scope.ordersreport[i].ordid ="";
		  $scope.ordersreport[i].doe ="";
		  $scope.ordersreport[i].customername ="";
		  $scope.ordersreport[i].grossamount ="";
		  $scope.ordersreport[i].orderstatus ="";
		  $scope.ordersreport[i].netamount =""; 
		  $scope.ordersreport[i].taxamount =""; 
		  $scope.ordersreport[i].entitype =""; 
	  }else{
		  var myprevidmaha = $scope.myordersreport[i].ordid;
	  }
  } 

  for(var i=0;i<$scope.ordersreport.length;i++)
  {
	    $scope.ordersreport[i].product_price_in=((($scope.ordersreport[i].unitprice)/((100+parseInt($scope.ordersreport[i].taxpercent))))*100);
		/* console.log( $scope.ordersreport[i].product_price_in); */
		$scope.ordersreport[i].netprice=$scope.ordersreport[i].qty*$scope.ordersreport[i].product_price_in;
		$scope.ordersreport[i].taxable=$scope.ordersreport[i].netprice;
		 $scope.ordersreport[i].cgstsgstamt=$scope.ordersreport[i].taxable * (($scope.ordersreport[i].taxpercent/2)/100);
  }
  
    $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.ordersreport.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.ordersreport.length / $scope.pageSize);
  };
  
   });
	 }
	 
	 $scope.orddatesearchreport = function(fromdate3,todate3) { 

    var dt = fromdate3.getDate();
		 var dm = fromdate3.getMonth()+1;
		 var dy = fromdate3.getFullYear();
		 var myfrdt1= dy+"-"+dm+"-"+dt;
		 fromdate3=myfrdt1;
		  var dt = todate3.getDate();
		 var dm = todate3.getMonth()+1;
		 var dy = todate3.getFullYear();
		 var mytodt1 = dy+"-"+dm+"-"+dt;
		todate3=mytodt1;
$http(
		{
            method: 'GET',
            url: 'api/orddatesearchreport/'+fromdate3+'/'+todate3,
            dataType: 'jsonp'
         }
	)
  .then(function(response){ 
  $scope.ordersreport= response.data;
  console.log($scope.ordersreport);
     $scope.myordersreport=$scope.ordersreport;
	var myprevidmaha = $scope.myordersreport[0].ordid;
   for(var i=1;i<$scope.ordersreport.length;i++){
	  
	  if(myprevidmaha == $scope.myordersreport[i].ordid){
		  $scope.ordersreport[i].ordid ="";
		  $scope.ordersreport[i].doe ="";
		  $scope.ordersreport[i].customername ="";
		  $scope.ordersreport[i].grossamount ="";
		  $scope.ordersreport[i].orderstatus ="";
		  $scope.ordersreport[i].netamount =""; 
		  $scope.ordersreport[i].taxamount ="";
            $scope.ordersreport[i].entitype =""; 		  
	  }else{
		  var myprevidmaha = $scope.myordersreport[i].ordid;
	  }
  } 

 for(var i=0;i<$scope.ordersreport.length;i++)
  {
	    $scope.ordersreport[i].product_price_in=((($scope.ordersreport[i].unitprice)/((100+parseInt($scope.ordersreport[i].taxpercent))))*100);
		/* console.log( $scope.ordersreport[i].product_price_in); */
		$scope.ordersreport[i].netprice=$scope.ordersreport[i].qty*$scope.ordersreport[i].product_price_in;
		$scope.ordersreport[i].taxable=$scope.ordersreport[i].netprice;
		 $scope.ordersreport[i].cgstsgstamt=$scope.ordersreport[i].taxable * (($scope.ordersreport[i].taxpercent/2)/100);
  }  
  });
  };	
	 $scope.checkcurrpage=function(myValue){
	
	 console.log($scope.checkcurrpage);

		if(myValue-1 <= 0){
			$scope.currentPage=0;
		}else{$scope.currentPage=myValue-1;
				if(!$scope.currentPage){$scope.currentPage=0;}		
				}
		};
		
		
		 $scope.getTotal1 = function(){
    var total = 0;
	console.log($scope.ordersreport.length);
	
	{
		for(var i = 0; i <$scope.ordersreport.length; i++){
			var order = $scope.ordersreport[i];
			if(order.netamount!=""){
			total += order.netamount;
			}		
	}
	}
return total;	
} 

 $scope.getTotal2 = function(){
    var total = 0;
	console.log($scope.ordersreport.length);
	
	{
		for(var i = 0; i <$scope.ordersreport.length; i++){
			var order = $scope.ordersreport[i];
			if(order.entitype=="Distributor"){
			total += order.netamount;
			}		
	}
	}
return total;	
} 

$scope.getTotal3 = function(){
    var total = 0;
	console.log($scope.ordersreport.length);
	
	{
		for(var i = 0; i <$scope.ordersreport.length; i++){
			var order = $scope.ordersreport[i];
			if(order.entitype=="Retailer"){
			total += order.netamount;
			}		
	}
	}
return total;	
} 

$scope.getTotal = function(){
    var total = 0;
	console.log($scope.vendorsreport.length);
	
	{
		for(var i = 0; i <$scope.vendorsreport.length; i++){
			var vendor_pur= $scope.vendorsreport[i];
			
			if(vendor_pur.netamount!=""){
			total += vendor_pur.netamount;
			}		
	}
	}
return total;	
} 
	 

 $scope.vendorsreports = function() { 
	
$http(
		{
            method: 'GET',
            url: 'api/allvendorreports/',
            dataType: 'jsonp'
         }
	)
  .then(function(response){ 
  $scope.vendorsreport= response.data;
  
 /*   $scope.myvendorsreport=$scope.vendorsreport;
	var myprevidmaha = $scope.myvendorsreport[0].purchaseid;
   for(var i=1;i<$scope.vendorsreport.length;i++){
	  
	  if(myprevidmaha == $scope.myvendorsreport[i].purchaseid){
		  $scope.vendorsreport[i].purchaseid ="";
		  $scope.vendorsreport[i].vendorname ="";
		    $scope.vendorsreport[i].entitytype ="";
		   $scope.vendorsreport[i].grossamount ="";
		  $scope.vendorsreport[i].netamount ="";
          $scope.vendorsreport[i].taxamount =""; 
        $scope.vendorsreport[i].doe ="";		  
	  }else{
		  var myprevidmaha = $scope.myvendorsreport[i].purchaseid;
	  } 
  }*/  
    $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.vendorsreport.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.vendorsreport.length / $scope.pageSize);
					}
  });
};

 $scope.GetVendorviseReport = function(vendorid,fromdate,todate) { 
	 if(fromdate != undefined)
		 {
	var dt= fromdate.getDate();
		  if(dt < 10)
				 dt ='0'+dt;
		 var dm = fromdate.getMonth()+1;
		 if(dm < 10)
				 dm='0'+dm;
		 var dy = fromdate.getFullYear();
		 var myfrdt1= dy+"-"+dm+"-"+dt;
		 fromdate=myfrdt1;
		 }
		 if(todate != undefined)
		 {
			 var dt = todate.getDate();
			 if(dt < 10)
				 dt ='0'+dt;
			 var dm = todate.getMonth()+1;
			 if(dm < 10)
				 dm='0'+dm;
			 var dy = todate.getFullYear();
			 var mytodt1 = dy+"-"+dm+"-"+dt;
			todate=mytodt1;
		 }
	
$http(
		{
            method: 'GET',
            url: 'api/GetVendorviseReport/'+vendorid+'/'+fromdate+'/'+todate,
            dataType: 'jsonp'
         }
	)
  .then(function(response){ 
  $scope.vendorsreport= response.data;
  console.log( $scope.vendorsreport);
   $scope.myvendorsreport=$scope.vendorsreport;
	var myprevidmaha = $scope.myvendorsreport[0].purchaseid;
  /*  for(var i=1;i<$scope.vendorsreport.length;i++){
	  
	  if(myprevidmaha == $scope.myvendorsreport[i].purchaseid){
		  $scope.vendorsreport[i].purchaseid ="";
		  $scope.vendorsreport[i].vendorname ="";
		    $scope.vendorsreport[i].entitytype ="";
		   $scope.vendorsreport[i].grossamount ="";
		  $scope.vendorsreport[i].netamount ="";
          $scope.vendorsreport[i].taxamount =""; 
        $scope.vendorsreport[i].doe ="";		  
	  }else{
		  var myprevidmaha = $scope.myvendorsreport[i].purchaseid;
	  }
  } */  
    $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.vendorsreport.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.vendorsreport.length / $scope.pageSize);
					}
  });
};


$scope.purdatesearchreport = function(fromdate,todate) { 

         var dt= fromdate.getDate();
		  if(dt < 10)
				 dt ='0'+dt;
		 var dm = fromdate.getMonth()+1;
		 if(dm < 10)
				 dm='0'+dm;
		 var dy = fromdate.getFullYear();
		 var myfrdt1= dy+"-"+dm+"-"+dt;
		 fromdate=myfrdt1;
		 if(todate != undefined)
		 {
			 var dt = todate.getDate();
			 if(dt < 10)
				 dt ='0'+dt;
			 var dm = todate.getMonth()+1;
			 if(dm < 10)
				 dm='0'+dm;
			 var dy = todate.getFullYear();
			 var mytodt1 = dy+"-"+dm+"-"+dt;
			todate=mytodt1;
		 }
		 if($scope.Vendor!= undefined && $scope.Vendor.id)
		 {
			 var vendorid = $scope.Vendor.id;
		 }
$http(
		{
            method: 'GET',
            url: 'api/purdatesearchreport/'+fromdate+'/'+todate+'/'+vendorid,
            dataType: 'jsonp'
         }
	)
  .then(function(response){ 
  $scope.vendorsreport= response.data;
  console.log($scope.vendorsreport);
       $scope.myvendorsreport=$scope.vendorsreport;
	var myprevidmaha = $scope.myvendorsreport[0].purchaseid;
   for(var i=1;i<$scope.vendorsreport.length;i++){
	  
	  if(myprevidmaha == $scope.myvendorsreport[i].purchaseid){
		  $scope.vendorsreport[i].purchaseid ="";
		  $scope.vendorsreport[i].vendorname ="";
		   $scope.vendorsreport[i].entitytype ="";
		   $scope.vendorsreport[i].grossamount ="";
		  $scope.vendorsreport[i].netamount ="";  
		  $scope.vendorsreport[i].taxamount ="";  
		  $scope.vendorsreport[i].doe ="";
	  }else{
		  var myprevidmaha = $scope.myvendorsreport[i].purchaseid;
	  }
  }  
  });
  };
  
 $scope.productreport = function() { 
$http(
		{
            method: 'GET',
            url: 'api/productreport/',
            dataType: 'jsonp'
         }
	)
  .then(function(response){ 
  $scope.reportproducts= response.data;
  console.log( $scope.reportproducts);
   $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.reportproducts.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.reportproducts.length / $scope.pageSize);
					}
  
  });
}






	 $scope.exportData = function (report) {
			$scope.pageSize=10;
		$scope.currentPage=0;
         var blob = new Blob([document.getElementById('exportablenew').innerHTML], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" 
		     /* url: 'data:application/vnd.ms-excel;'  */
		   
        });
        saveAs(blob,report);
		/*  $window.location.reload(); */
    };
	
	
	$scope.salereturnreport = function() { 
$http(
		{
            method: 'GET',
            url: 'api/salereturnreport/',
            dataType: 'jsonp'
         }
	)
  .then(function(response){ 
  $scope.salereturnreport= response.data;
  console.log( $scope.salereturnreport);
   $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.salereturnreport.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.salereturnreport.length / $scope.pageSize);
					}
  
  });
}

$scope.salereturndatereport = function(fromdate,todate) { 
         var dt= fromdate.getDate();
		 var dm = fromdate.getMonth()+1;
		 var dy = fromdate.getFullYear();
		 var myfrdt1= dy+"-"+dm+"-"+dt;
		 fromdate=myfrdt1;
		  var dt = todate.getDate();
		 var dm = todate.getMonth()+1;
		 var dy = todate.getFullYear();
		 var mytodt1 = dy+"-"+dm+"-"+dt;
		todate=mytodt1;
$http(
		{
            method: 'GET',
            url: 'api/salereturndatereport/'+fromdate+'/'+todate,
            dataType: 'jsonp'
         }
	)
  .then(function(response){ 
  $scope.salereturnreport= response.data;
  console.log($scope.salereturnreport);
  });
};

$scope.purreturnreport = function() { 
$http(
		{
            method: 'GET',
            url: 'api/purreturnreport/',
            dataType: 'jsonp'
         }
	)
  .then(function(response){ 
  $scope.purreturnreport= response.data;
  console.log( $scope.purreturnreport);
  $scope.mypurreport=$scope.purreturnreport;
	var myprevidmaha = $scope.mypurreport[0].purid;
   for(var i=1;i<$scope.purreturnreport.length;i++){
	  
	  if(myprevidmaha == $scope.mypurreport[i].purid){
		  $scope.purreturnreport[i].purid ="";
		   $scope.purreturnreport[i].grossamount ="";
		  $scope.purreturnreport[i].netamount ="";  
	      $scope.purreturnreport[i].doe ="";
	  }else{
		  var myprevidmaha = $scope.mypurreport[i].purid;
	  }
  }  
   $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.purreturnreport.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.purreturnreport.length / $scope.pageSize);
					}
  
  });
}

$scope.purreturndatereport = function(fromdate,todate) { 
         var dt= fromdate.getDate();
		 var dm = fromdate.getMonth()+1;
		 var dy = fromdate.getFullYear();
		 var myfrdt1= dy+"-"+dm+"-"+dt;
		 fromdate=myfrdt1;
		  var dt = todate.getDate();
		 var dm = todate.getMonth()+1;
		 var dy = todate.getFullYear();
		 var mytodt1 = dy+"-"+dm+"-"+dt;
		todate=mytodt1;
$http(
		{
            method: 'GET',
            url: 'api/purreturndatereport/'+fromdate+'/'+todate,
            dataType: 'jsonp'
         }
	)
  .then(function(response){ 
  $scope.purreturnreport= response.data;
  console.log($scope.purreturnreport);
  $scope.mypurreport=$scope.purreturnreport;
	var myprevidmaha = $scope.mypurreport[0].purid;
   for(var i=1;i<$scope.purreturnreport.length;i++){
	  if(myprevidmaha == $scope.mypurreport[i].purid){
		  $scope.purreturnreport[i].purid ="";
		   $scope.purreturnreport[i].grossamount ="";
		  $scope.purreturnreport[i].netamount ="";  
	      $scope.purreturnreport[i].doe ="";
	  }else{
		  var myprevidmaha = $scope.mypurreport[i].purid;
	  }
  }  
  });
};

$scope.productsalereport = function() { 
$http(
		{
            method: 'GET',
            url: 'api/productsalereport/',
            dataType: 'jsonp'
         }
	)
  .then(function(response){ 
  $scope.productsalereport= response.data;
  console.log( $scope.productsalereport);
   $scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > $scope.productsalereport.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
					return Math.ceil($scope.productsalereport.length / $scope.pageSize);
					}
  
  });
}


$scope.productsalesrchreport = function(fromdate,todate) { 
         var dt= fromdate.getDate();
		 var dm = fromdate.getMonth()+1;
		 var dy = fromdate.getFullYear();
		 var myfrdt1= dy+"-"+dm+"-"+dt;
		 fromdate=myfrdt1;
		  var dt = todate.getDate();
		 var dm = todate.getMonth()+1;
		 var dy = todate.getFullYear();
		 var mytodt1 = dy+"-"+dm+"-"+dt;
		todate=mytodt1;
$http(
		{
            method: 'GET',
            url: 'api/productsalesrchreport/'+fromdate+'/'+todate,
            dataType: 'jsonp'
         }
	)
  .then(function(response){ 
  $scope.productsalereport= response.data;
  console.log($scope.productsalereport);
  });
};




 
  });
  