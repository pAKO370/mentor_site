(function() {
	function TopicsCtrl($scope,Fixtures){
		$scope.topics = Fixtures.getTopics();
	}

	angular	
		.module('mentorSite')
		.controller('TopicsCtrl', TopicsCtrl);
	
})();