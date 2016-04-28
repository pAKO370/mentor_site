
(function() {
	function calendly($document, $user){
		return{
			template: '<div class="calendly-inline-widget" data-url="https://calendly.com/pfluegelcx" style="min-width:320px;height:750px;"></div>',
			replace: true,
			restrict: 'E',
			scope:  {
			},
			link: function(scope, element, attributes) {
				Calendly.initInlineWidgets()
				
				
			}
		};
	}
			
			angular
		.module('mentorSite')
		.directive('calendly', calendly);
	
})();
