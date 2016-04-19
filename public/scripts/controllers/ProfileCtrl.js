(function(){
	function ProfileCtrl($scope, $user,$firebaseArray,$firebaseObject){
		$scope.user = $user;
		var ref = new Firebase("https://mentorsite.firebaseIO.com/users");
		$scope.info = $firebaseObject(ref)
		
			$scope.save = function(){
				$scope.edit = !$scope.edit;
				
				/*$scope.info.username = $scope.user.email;*/
				$scope.info.name = $scope.profile.name;
				$scope.info.age = $scope.profile.age;
				$scope.info.topic = $scope.profile.topic;
				$scope.info.years = $scope.profile.years;
				$scope.info.background = $scope.profile.background;
				console.log($scope.user)
				$scope.info.$save();
			}
			$scope.ranges = function(min,max) {
				$scope.range = [];
				for (var i = min; i <= max; i++) {
				   				$scope.range.push(i);
				}
				return $scope.range;
			}
			
	}
	
	
	angular
		.module('mentorSite')
		.controller('ProfileCtrl', ProfileCtrl)
	
})();