(function(){
	function config($stateProvider, $locationProvider){
		$locationProvider
			.html5Mode({
			enabled: true,
		  requireBase: false
		});
		
		
		$stateProvider
			.state('landing', {
				url: '/',
				templateUrl: 'templates/landing.html',
				controller: 'MainCtrl'
		})
		.state('login',{
				url: '/login',
				templateUrl: 'templates/user/login.html'	
		}) 
		.state('signUp', {
			url: '/signup',
			templateUrl: 'templates/user/register.html'
		})
		.state('topics', {
			url: '/topics',
			templateUrl: 'templates/topics.html'
		})
		.state('info',{
			url: '/info',
			templateUrl: 'templates/info.html'
		})
		.state('profile',{
			url: '/profile',
			templateUrl: 'templates/profile.html',
			sp: {
				authenticate: true
			}
		})
		.state('software', {
			url: '/software',
			templateUrl: 'templates/topics/software.html',
			resolve: {
				"currentAuth": ['Auth' , function(Auth){
					return Auth.$requireAuth();
				}]
			}
		})
		.state('design', {
			url: '/design',
			templateUrl: 'templates/topics/design.html'
			
		})
		.state('business', {
			url: '/business',
			templateUrl: 'templates/topics/business.html'
		})
		.state('construction', {
			url: '/construction',
			templateUrl: 'templates/topics/construction.html'
		})
		.state('acting', {
			url: '/acting',
			templateUrl: 'templates/topics/acting.html'
		})
		.state('photography', {
			url: '/photography',
			templateUrl: 'templates/topics/photography.html'
		})
		.state('connor',{
			url: '/johnO',
			templateUrl: 'templates/topics/mentors/connor.html'
		})
		.state('phil',{
			url: '/philF',
			templateUrl: 'templates/topics/mentors/phil.html'
		})
		.state('adam',{
			url: '/adamL',
			templateUrl: 'templates/topics/mentors/adam.html'
		})
		
	}




	angular.module('mentorSite', ["ui.router","firebase"])
	.config(config)
	

	
})();
