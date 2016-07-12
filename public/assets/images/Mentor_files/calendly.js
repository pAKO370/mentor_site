
(function() {
	function calendly($document,Fixtures){
		return{
			templateUrl: 'templates/directives/calendy.html' ,
			replace: true,
			restrict: 'E',
			scope:  {},
			link: function(scope, element, attributes) {
				var mentors = Fixtures.getMentor();
				var calendy = mentors[1].calendy;
				$('.cal').append(calendy);
				Calendly.initInlineWidgets()
				
			}
		};
	}
			
			angular
		.module('mentorSite')
		.directive('calendly', calendly);
	
})();
