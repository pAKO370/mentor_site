(function(){
	function Fixtures() {
		var Fixtures= {};
	
	var topics =[
		{title: 'Software', class: 'ion-ios-monitor-outline',template: 'software'},
		{title: 'Deisgn', class: 'ion-paintbrush',template: 'design'},
		{title: 'Business', class: 'ion-person',template: 'business'},
		{title: 'Construction', class: 'ion-hammer',template: 'construction'},
		{title: 'Acting', class: 'ion-film-marker',template: 'acting'},
		{title: 'Photography', class: 'ion-camera',template: 'photography'}
	];
		
	
	Fixtures.getTopics = function(){
		return topics;
	};
		return Fixtures;
}
 
 angular
 	.module('mentorSite')
	.factory('Fixtures', Fixtures);
})();