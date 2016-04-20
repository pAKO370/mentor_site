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
			.state('loginState',{
			url: '/login',
			templateUrl: 'templates/login.html'
		})
		.state('signUp', {
			url: '/signup',
			templateUrl: 'templates/signup.html'
		})
		.state('topics', {
			url: '/topics',
			templateUrl: 'templates/topics.html'
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
			templateUrl: 'templates/topics/software.html'
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
		
	}




	angular.module('mentorSite', ["ui.router","stormpath", "stormpath.templates","firebase"/*,"lr.upload"*/])
	.config(config)
	.run(function($stormpath) {
		$stormpath.uiRouter({
			loginState: 'login',
			defaultPostLoginState: 'landing'
		})
	});
})();
