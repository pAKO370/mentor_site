(function(){
	function MentorCtrl($scope, Fixtures){
		$scope.software = Fixtures.getMentor();
		$scope.eventSources = [];
		
		//var mentors = Fixtures.getMentor();
		$scope.calendy = $scope.software[1].calendy;
				
		
	}
	angular
		.module('mentorSite')
		.controller('MentorCtrl',MentorCtrl)
	
})();