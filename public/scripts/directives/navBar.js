
(function() {
	function navBar($document){
		return{
			templateUrl: 'templates/directives/nav-bar.html' ,
			replace: true,
			restrict: 'E',
			scope:  {},
			link: function(scope, element, attributes) {
				$('.ion-navicon-round').click(function(){
					$('.mobile-nav').css({'margin-top': 0});
				});
				$('.ion-chevron-up').click(function(){
					$('.mobile-nav').css({'margin-top': -450 + 'px'});
				})
				$('.mobile-nav a').click(function(){
					$('.mobile-nav').css({'margin-top': -450 + 'px'});
				})
			}
		};
	}
			
		angular
		.module('mentorSite')
		.directive('navBar', navBar);
	
})();