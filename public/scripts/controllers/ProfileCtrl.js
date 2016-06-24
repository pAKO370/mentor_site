(function(){
	function ProfileCtrl($scope,$firebaseArray,$firebaseObject){
		//$scope.username = {};
		
		
	
		/*$user.get()
    .then(function (user) {
      console.log('The current user is', user);
			//$scope.username = user;
			
			var fireUrl = user.username;
			fireUrl = fireUrl.replace("@","_");
			fireUrl = fireUrl.replace(".","_");
			console.log(fireUrl);
			var ref = new Firebase("https://mentorsite.firebaseIO.com/users/"+fireUrl);
			$scope.info = $firebaseObject(ref);
    })
    .catch(function (error) {
      console.log('Error getting user', error);
    });
		
		
		

		//var ref = new Firebase("https://mentorsite.firebaseio.com/users/" + $scope.user.username);
										 
		//console.log("user is",ref);
										 
		//$scope.info = $firebaseObject(ref);
		//$scope.profile = $scope.info;
		
	*/
		
			$scope.save = function(){
				$scope.editable = !$scope.editable;
				/*$scope.info.username = $scope.user.email;*/
				$scope.info.name = $scope.profile.name;
				$scope.info.age = $scope.profile.age;
				$scope.info.topic = $scope.profile.topic;
				$scope.info.years = $scope.profile.years;
				$scope.info.background = $scope.profile.background;
				console.log($scope.user)
				$scope.info.$save();
			}
			$scope.edit = function() {
				$scope.editable = true;
				$scope.profile.name = $scope.info.name;
				$scope.profile.age = $scope.info.age;
				$scope.profile.topic = $scope.info.topic;
				$scope.profile.years = $scope.info.years;
				$scope.profile.background = $scope.info.background;
			
		
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