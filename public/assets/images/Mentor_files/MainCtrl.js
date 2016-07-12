(function() {
	function MainCtrl($scope, $rootScope){
  	/*$rootScope.$on('$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams){
				if (fromState.name == 'loginState'){
					$user.get()
				.then(function (user) {
				 $scope.currentUser = user.username;
					console.log($scope.currentUser);
				})
				.catch(function (error) {
					console.log('Error getting user', error);
				});
			}
		});*/ 
	}
	angular
		.module('mentorSite')
		.controller('MainCtrl', MainCtrl)
})();