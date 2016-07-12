angular
.module('mentorSite')
.factory('Auth', function($firebaseAuth){
	var ref = new Firebase("https://mentorsite.firebaseIO.com");
	return $firebaseAuth(ref);
});