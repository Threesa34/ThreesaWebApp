var reportApp = angular.module('reportApp', ['ui.bootstrap']).filter('startFrom', function() {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
}); 
  reportApp.controller('reportController', function($scope, $http,$window,$rootScope,$sce) {
	  /*  $scope.distributor_id=$window.sessionStorage['userid']  ;
    

	    if($window.sessionStorage["state"])
	  {
		  $scope.statename1=$window.sessionStorage["state"];
		  console.log($scope.statename1);
		  $scope.statename=$scope.statename1.replace(/\"/g, ""); 
	  }	 */
	 $scope.orderreport=function(){
		 $http(
		{
            method: 'GET',
            url: 'http://35.194.248.238:8382/api/allorderreport/',
            dataType: 'jsonp'
         }
	)
  .then(function(response){ 
  $scope.ordersreport= response.data;
  console.log( $scope.ordersreport);
	 }
  
  
 
  });
  