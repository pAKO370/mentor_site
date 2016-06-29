(function() {
	function UserCtrl($scope, Auth, $state){
		
		$scope.auth = Auth;
		//registers new user
		$scope.addUser = function(){
			$scope.message = null;
      $scope.error = null;
			//checks for password
			if(!$scope.password){
				$scope.error= 'Please enter your pasword!';
				return;
			}
			//checks for email 
			if(!$scope.email){
				$scope.error = "Please enter an email address!"
				return
			}
			// checks that each password value matches
			if($scope.password === $scope.password2){
				
				$scope.auth.$createUser({
					name: $scope.name,
					email: $scope.email,
					password: $scope.password

				}).then(function(userData){
					$scope.login($scope.email, $scope.password);
					$scope.message = "User created with uid " + userData.uid;
				}).catch(function(error){
					if(error.code == 'EMAIL_TAKEN'){
						$scope.error = 'Email already in use. Please chose a new email!';
					}
				});
			}else{
				$scope.error = "Passwords do not match!";
			};
			
		}
		$scope.login = function(){
			$scope.authData = null;
			$scope.error = null;
			if(!$scope.password){
				$scope.error= 'Please enter your pasword!';
				return;
			}
			if(!$scope.email){
				$scope.error = "Please enter an email address!"
				return
			}
			$scope.auth.$authWithPassword({
				email: $scope.email,
				password: $scope.password
			}).then(function(authData) {
				console.log("Logged in as:", authData.uid);
			}).catch(function(error) {
				if(error.code == 'INVALID_USER'){
					$scope.error = $scope.email + " is not a registered user!";
					return
				}
			});
			if($scope.error == null){
				$state.go('landing');
			}
		}
		
		$scope.auth.$onAuth(function(authData) {
    	$scope.authData = authData;
    })
		 
		$scope.logout = function() {
    	$scope.auth.$unauth();
  	};
		
	}

	angular	
		.module('mentorSite')
		.controller('UserCtrl', UserCtrl);
	
})();