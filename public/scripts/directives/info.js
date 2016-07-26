
(function() {
	function info($document){
		return{
			templateUrl: 'templates/directives/info.html' ,
			replace: true,
			restrict: 'E',
			scope:  {},
			link: function(scope, element, attributes) {
				
			$('.top img').css({'transform': 'translateX(-50px)'}).css({'opacity': 0});
			$('.mid img').css({'transform': 'translateX(50px)'}).css({'opacity': 0});
			$('.bot img').css({'transform': 'translateX(-50px)'}).css({'opacity': 0});
			$(window).scroll(function(){
				var wScroll = $(this).scrollTop();
				var windowHeight = $(window).height();

		if(wScroll > $('.top').offset().top - windowHeight / 1.2){
				$('.top img').css({'transform': 'translateX(0)'}).css({'opacity': 1});
			}
		if(wScroll > $('.mid').offset().top - windowHeight / 1.2){
				$('.mid img').css({'transform': 'translateX(0)'}).css({'opacity': 1});
			}
		if(wScroll > $('.bot').offset().top - windowHeight / 1.2){
				$('.bot img').css({'transform': 'translateX(0)'}).css({'opacity': 1});
			}

		
				
			})
		}
	}
}
											
		angular
		.module('mentorSite')
		.directive('info', info);
	
})();