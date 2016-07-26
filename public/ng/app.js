angular.module('churchSite', ['ngRoute', 'sermons', 'events']);

angular.module('churchSite').config(function($routeProvider, $locationProvider){
	$routeProvider
	.when('/sermons', { templateUrl: '/ng/sermons/sermonsMain.html', controller: 'SermonsController' })
	.when('/admin/sermons', { templateUrl: '/ng/sermons/sermonsAdminMain.html', controller: 'SermonsAdminController' })
	.when('/admin/sermons/add', { templateUrl: '/ng/sermons/sermonsAdd.html', controller: 'SermonsAddController' })
	.when('/admin/sermons/edit/:sermonId', { templateUrl: '/ng/sermons/sermonsEdit.html', controller: 'SermonsEditController' })
	.when('/admin', { templateUrl: '/ng/admin/admin.html'})
	.when('/events', { templateUrl: '/ng/events/events.html', controller: 'EventsController'})
});

angular.module('churchSite').directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function(){
				scope.$apply(function(){
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
}]);

angular.module('churchSite').directive('validFile',function(){
	return {
		require:'ngModel',
		link:function(scope,el,attrs,ngModel){
			//change event is fired when file is selected
			el.bind('change',function(){
				scope.$apply(function(){
					ngModel.$setViewValue(el.val());
					ngModel.$render();
				});
			});
		}
	}
});

