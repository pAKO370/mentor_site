
(function() {
	function scrollArrow($document){
		return{
			templateUrl: 'templates/directives/scroll-arrow.html' ,
			replace: true,
			restrict: 'E',
			scope:  {},
			link: function(scope, element, attributes) {
				
			function clickScroll(className, targetClass){
				$(className).click(function(){
					$('html, body').animate({
					scrollTop: ($(targetClass).offset().top-55)
					}, 'slow');
				});
			}
			clickScroll('.ion-chevron-down','.info-div');
			}
		};
	}
		angular
		.module('mentorSite')
		.directive('scrollArrow', scrollArrow);
	
})();