
var appAdv = angular.module('appAdv', ['ui.bootstrap']).filter('startFrom', function () {
    return function (input, start) {
        start = +start;
         if(input!=undefined)
        {return input.slice(start);}
    }
}); 
  appAdv.controller('AdvController', function($scope,$http,$window) {
	  
		
		
		$scope.GetAdvertisementDetails = function(advid)
				{
					$scope.advid = advid;
				};	
				
				
			$scope.AddNewEnquiry= function()
			{
				$scope.customer.source = 'Advertisement';
				$scope.customer.advid = $scope.advid;
				$http({
							    method  : 'POST',
								url     : 'http://103.252.7.5:8897/api/AddNewEnquiry/',
								data    : $scope.customer ,
								headers : {'Content-Type': 'application/json'} 
					})
					.success(function(data) {
						alert(data.message);
						location.reload(); 
					});
			};	
  });