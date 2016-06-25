(function() {
	function UserCtrl($scope){
		$scope.addUser = function(){
			$scope.user.name = $scope.user.name;
			$scope.user.email = $scope.user.email;
			$scope.user.password = $scope.user.password;
			$scope.user.password2 = $scope.user.password2;
			if($scope.user.name && $scope.user.password && $scope.user.email){
				if($scope.user.password !== $scope.user.password2){
					alert('passwords do not match');
					return
				}
				console.log($scope.user);
			}else{
				console.log("please fill in empty");
			}
		}
	}

	angular	
		.module('mentorSite')
		.controller('UserCtrl', UserCtrl);
	
})();