(function(){
	function MentorCtrl($scope, Fixtures){
		$scope.software = Fixtures.getMentor();
		$scope.eventSources = [];
		
		
		
	}
	angular
		.module('mentorSite')
		.controller('MentorCtrl',MentorCtrl)
	
})();