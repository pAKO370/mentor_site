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
	var softwareMentors = [
		{name:"John O'Connor", image: "/assets/images/john-oConnor.jpg", subjects: "Javascript, HTML, CSS, Angular, Java, C#",years: "20", template: "connor"},
		{name:"Phil Fluegel", image: "/assets/images/phil.jpg", subjects: "Javascript, HTML, CSS, Angular", years: "1",template: "phil",calendly: "<div class='calendly-inline-widget' data-url='https://calendly.com/pfluegelcx' style='min-width:320px;height:580px;'></div>"},
		{name:"Amy Smith", image: "/assets/images/amy.jpg", subjects: "Ruby, Ruby on Rails", years: "7",template: "adam"}
	];
		
		
	
	Fixtures.getTopics = function(){
		return topics;
	};
	Fixtures.getMentor = function(){
		return softwareMentors;
	};
		return Fixtures;
}
 
 angular
 	.module('mentorSite')
	.factory('Fixtures', Fixtures);
})();