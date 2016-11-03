(function() {

	'use strict';

	angular
		.module('churchSite', ['ui.router', 'satellizer','ngMaterial',
		                        'ngMessages',
		                        'ngSanitize',
		               		    	'com.2fdevs.videogular',
		            						'com.2fdevs.videogular.plugins.controls',
		            						'com.2fdevs.videogular.plugins.overlayplay',
		            						'com.2fdevs.videogular.plugins.poster',
					            			'smart-table',
					            			'ngConfirm',
					            			'ui.bootstrap'])
		.config(["$stateProvider", "$urlRouterProvider", "$urlMatcherFactoryProvider", "$authProvider", "$httpProvider", "$provide", function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $authProvider, $httpProvider, $provide) {

			redirectWhenLoggedOut.$inject = ["$q", "$injector"];
			function redirectWhenLoggedOut($q, $injector) {

				return {

					responseError: function(rejection) {

						// Need to use $injector.get to bring in $state or else we get
						// a circular dependency error
						var $state = $injector.get('$state');

						// Instead of checking for a status code of 400 which might be used
						// for other reasons in Laravel, we check for the specific rejection
						// reasons to tell us if we need to redirect to the login state
						var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

						// Loop through each rejection reason and redirect to the login
						// state if one is encountered
						angular.forEach(rejectionReasons, function(value, key) {

							if(rejection.data.error === value) {

								// If we get a rejection corresponding to one of the reasons
								// in our array, we know we need to authenticate the user so
								// we can remove the current user from local storage
								localStorage.removeItem('user');

								// Send the user to the auth state so they can login
								$state.go('auth');
							}
						});

						return $q.reject(rejection);
					}
				}
			}

			// Setup for the $httpInterceptor
			$provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);

			// Push the new factory onto the $http interceptor array
			$httpProvider.interceptors.push('redirectWhenLoggedOut');

			$authProvider.loginUrl = '/api/authenticate';

			$urlMatcherFactoryProvider.strictMode(false);

			//$urlRouterProvider.otherwise('/auth');

			$stateProvider
				.state('auth', {
					url: '/auth',
					templateUrl: '../ng/auth/authView.html',
					controller: 'AuthController as auth'
				})
				.state('logout', {
					url: '/logout',
					templateUrl: '../ng/auth/logoutView.html',
					controller: 'LogoutController as logout'
				})
				.state('sermons', {
					url: '/sermons',
					views: {
						'': {
							templateUrl: '/ng/sermons/views/sermons.html',
							controller: 'SermonsController as sermonController'
						},
						'sermonAudio@sermons': {
							templateUrl: '/ng/sermons/views/sermonAudioPlayer.html'
						}
					},
					abstract: true

				})
				.state('sermons.main',{
					url: '',
					views: {
						'sermonTable@sermons': {
							templateUrl: '/ng/sermons/views/sermonsMain.html'
						}
					}
				})
				.state('sermons.admin',{
					url: '/admin',
					views: {
						'sermonTable@sermons': {
							templateUrl: '/ng/sermons/views/sermonsAdmin.html'
						}
					}
				})
				.state('sermons.admin.add', {
					url: '/add',
					views: {
						'sermonForm@sermons.admin': {
							templateUrl: '/ng/sermons/views/sermonsAdd.html',
							controller: 'SermonsAddController as addSermonsController'
						}
					}
				})
				.state('sermons.admin.edit', {
					url: '/edit/{:sermonId}',
					views: {
						'sermonForm@sermons.admin': {
							templateUrl: '/ng/sermons/views/sermonsEdit.html'
						}
					}
				})
				.state('admin', {
					url: '/admin',
					templateUrl: '/ng/admin/admin.html'
				})
				.state('events', {
					url: '/events',
					templateUrl: '/ng/events/events.html',
					controller: 'EventsController as events'
				});
		}])
		.run(["$rootScope", "$state", "$location", function($rootScope, $state, $location) {

			// $stateChangeStart is fired whenever the state changes. We can use some parameters
			// such as toState to hook into details about the state as it is changing
			$rootScope.$on('$stateChangeStart', function(event, toState) {

				// Grab the user from local storage and parse it to an object
			//	var user = JSON.parse(localStorage.getItem('user'));

				// If there is any user data in local storage then the user is quite
				// likely authenticated. If their token is expired, or if they are
				// otherwise not actually authenticated, they will be redirected to
				// the auth state because of the rejected request anyway
				// if(toStage.name === "admin"){
				// 		if(user) {
				//
				// 		// The user's authenticated state gets flipped to
				// 		// true so we can now show parts of the UI that rely
				// 		// on the user being logged in
				// 		$rootScope.authenticated = true;
				//
				// 		// Putting the user's data on $rootScope allows
				// 		// us to access it anywhere across the app. Here
				// 		// we are grabbing what is in local storage
				// 		$rootScope.currentUser = user;
				//
				// 		// If the user is logged in and we hit the auth route we don't need
				// 		// to stay there and can send the user to the main state
				// 		if(toState.name === "auth") {
				// 			// Preventing the default behavior allows us to use $state.go
				// 			// to change states
				// 			event.preventDefault();
				//
				// 			// go to the "main" state which in our case is users
				// 			$state.go('welcome');
				// 		}
				// 	}else{
				// 		$location.path('/auth');
				// 	}
				// }
			});
		}])
		.directive('fileModel', ['$parse', function ($parse) {
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
		}])
		.directive('validFile',function(){
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
})();

/*angular.module('events', ['ngMaterial',
                        'ngMessages',
                        'ngSanitize',
            			'ngConfirm',
            			'ui.calendar',
            			'ui.bootstrap']);

angular.module('events').service('eventsSvc', function($http, $window){


});

angular.module('events').controller('EventsController', function($scope, sermonSvc){

    $scope.uiConfig = {
      calendar:{
    	  height: 800
      }
    };


});*/

(function(){
  'use strict';

  SermonsController.$inject = ["$state", "$window", "SermonAudioPlayer", "SermonTable"];
  angular
    .module('churchSite')
    .controller('SermonsController', SermonsController);

  function SermonsController($state, $window, SermonAudioPlayer, SermonTable){
    var vm = this;

    vm.sermonTitle = "Sermons";
    vm.audioPlayer = new SermonAudioPlayer();
    vm.sermonTable = new SermonTable();

    vm.deleteSermonWrapper = function(sermon){
      sermon.deleteSermon().then(function(){
        $window.alert("Sermon deleted.");
        $state.go($state.current, null, { reload: true });
      });
    }
  }
})();

(function(){
  'use strict';

  SermonsAddController.$inject = ["$state", "$rootScope", "SermonObj"];
  angular
    .module('churchSite')
    .controller('SermonsAddController', SermonsAddController)

  function SermonsAddController($state, $rootScope, SermonObj){
    var vm = this;
    vm.currSermon = new SermonObj();

    vm.addSermonWrapper = function(){
      vm.currSermon.addSermon().then(function(){
        $state.go('sermons.admin');
      });
    }
  }
})();

(function(){
  'use strict';

  SermonsAdminController.$inject = ["$state", "$rootScope", "SermonsService"];
  angular
    .module('churchSite')
    .controller('SermonsAdminController', SermonsAdminController)

  function SermonsAdminController($state, $rootScope, SermonsService){
    var vm = this;

    vm.audioPlayer = new SermonAudioPlayer();
    vm.sermonTable = new SermonTable();

    vm.callServer = function(tableState){
  		console.log(tableState);
  		var parameters = {};

  		if(tableState.search.predicateObject != undefined){
  			parameters.searchTerm = tableState.search.predicateObject["$"];
  		}

  		if(tableState.sort.predicate != undefined){
  			parameters.sortPredicate = tableState.sort.predicate;
  			parameters.sortOrder = tableState.sort["reverse"] ? 'descending' : 'ascending';
  		}

  		parameters.pageStart = tableState.pagination.start;

  		var getAllSermons = SermonsService.getSermons(parameters);

  		getAllSermons.success(function(results, status, headers, config){
  			vm.sermons = results.data;
  			tableState.pagination.numberOfPages = results.pageCount;
  		});

  		getAllSermons.error(function(data,status,headers,config){
  			vm.sermons = [];
  		});
  	};


  	vm.deleteSermon = function(id){

  		var deleteFunction = sermonSvc.deleteSermon(id);

  		deleteFunction.success(function(results, status, headers, config){
  			$window.alert("Sermon deleted.");
  			$route.reload();
  		});

  	}

  }
})();

(function(){
  'use strict';

  SermonsEditController.$inject = ["$state", "$rootScope", "$routeParams", "SermonsService"];
  angular
    .module('churchSite')
    .controller('SermonsEditController', SermonsEditController)

  function SermonsEditController($state, $rootScope, $routeParams, SermonsService){
    var vm = this;
    vm.currSermon = new SermonObj();

    SermonsService.getSermon($routeParams.sermonId).then(function(data){
        currSermon.loadSermon(data);
    });

    vm.editSermonWrapper = function(){
      currSermon.editSermon(function(){
        $state.go('/sermons/admin');
      });
    }
  }
})();

(function(){
  'use strict';

  SermonsMainController.$inject = ["$state", "$rootScope", "SermonsService"];
  angular
    .module('churchSite')
    .controller('SermonsMainController', SermonsMainController)

  function SermonsMainController($state, $rootScope, SermonsService){
    var vm = this;

    vm.callServer = function(tableState){
      console.log(tableState);
      var parameters = {};

      if(tableState.search.predicateObject != undefined){
        parameters.searchTerm = tableState.search.predicateObject["$"];
      }

      if(tableState.sort.predicate != undefined){
        parameters.sortPredicate = tableState.sort.predicate;
        parameters.sortOrder = tableState.sort["reverse"] ? 'descending' : 'ascending';
      }

      parameters.pageStart = tableState.pagination.start;

      var getAllSermons = SermonsService.getSermons(parameters);

      getAllSermons.success(function(results, status, headers, config){
        vm.sermons = results.data;
        tableState.pagination.numberOfPages = results.pageCount;
      });

      getAllSermons.error(function(data,status,headers,config){
        vm.sermons = [];
      });
    };

  }
})();

(function(){
  'use strict';

  SermonObj.$inject = ["$http", "$window", "$state", "SermonsService"];
  angular
    .module('churchSite')
    .factory('SermonObj', SermonObj);

    function SermonObj($http, $window, $state, SermonsService){

      var sermonObj = function(){
        var self = this;

        self.id = 0;
        self.title = "";
        self.title_kr = "";
        self.pastor = "";
        self.date = new Date();
        self.description = "";
        self.description_kr = "";
        self.pastor_kr = "";
        self.audioFile = "";
        self.uploadFile = {};

        self.loadSermon = function(sermon){
          self.id = sermon._id;
          self.title = sermon.title;
          self.title_kr = sermon.title_kr;
          self.pastor = sermon.pastor;
          self.date = new Date(sermon.date);
          self.description = sermon.description;
          self.description_kr = sermon.description_kr;
          self.pastor_kr = sermon.pastor_kr;
          self.audioFile = sermon.audioFile;
        }

        self.addSermon = function(){
          var fd = new FormData();
          fd.append('file', self.uploadFile);
          fd.append('title', self.title);
          fd.append('title_kr', self.title_kr );
          fd.append('pastor', self.pastor );
          fd.append('date', self.date);
          fd.append('description', self.description);
          fd.append('description_kr', self.description_kr);
          fd.append('pastor_kr', self.pastor_kr);
          
          return SermonsService.addSermon(fd);
        }

        self.saveSermon = function(){
          var fd = new FormData();
          fd.append('id', self.id);
          fd.append('file', self.uploadFile);
          fd.append('title', self.title);
          fd.append('title_kr', self.title_kr );
          fd.append('pastor', self.pastor );
          fd.append('date', self.date);
          fd.append('description', self.description);
          fd.append('description_kr', self.description_kr);
          fd.append('pastor_kr', self.pastor_kr);

          return SermonsService.editSermon(fd);
        }

        self.deleteSermon = function(){
          return SermonsService.deleteSermon(self.id);
        }
      }

      return (sermonObj);
  }

})();

(function(){
  'use strict';

  SermonAudioPlayer.$inject = ["$sce"];
  angular
    .module('churchSite')
    .factory('SermonAudioPlayer', SermonAudioPlayer)

    function SermonAudioPlayer($sce){

      var audioPlayer = function(){
        var self = this;

        self.API = null;
        self.audioId = null;

        self.onPlayerReady = function(API) {
          self.API = API;
        }

        self.onChangeSource = function(source){
          self.API.play();
        }


        self.config = {
          sources: [],
          theme: "bower_components/videogular-themes-default/videogular.css"
        };

        self.setAudio = function(id, audioFile){
          if(id === self.audioId){
            self.API.playPause();
          }else{
            self.API.stop();
            self.config.sources = [{ src: $sce.trustAsResourceUrl("/media/getMedia?fileName=" + audioFile), type: "audio/mp3"}];
            self.audioId = id;
          }
        };

        self.checkAudioId = function(id){
          return id === self.audioId;
        };

        self.isPlaying = function(){
          return self.API.currentState == 'play';
        };

        self.isPaused = function(){
          return self.API.currentState == 'pause' || self.API.currentState == 'stop' ;
        };

      }

      return (audioPlayer);

  }

})();

(function(){
  'use strict';

  SermonTable.$inject = ["$http", "$window", "$state", "SermonsService", "SermonObj"];
  angular
    .module('churchSite')
    .factory('SermonTable', SermonTable)

    function SermonTable($http, $window, $state, SermonsService, SermonObj){

      var sermonTable = function(){
        var self = this;
        self.sermons = [];

        self.callServer = function(tableState){
      		console.log(tableState);
      		var parameters = {};
          self.sermons = [];

      		if(tableState.search.predicateObject != undefined){
      			parameters.searchTerm = tableState.search.predicateObject["$"];
      		}

      		if(tableState.sort.predicate != undefined){
      			parameters.sortPredicate = tableState.sort.predicate;
      			parameters.sortOrder = tableState.sort["reverse"] ? 'descending' : 'ascending';
      		}

      		parameters.pageStart = tableState.pagination.start;

      		 SermonsService.getSermons(parameters).then(function(results){

            for(var i = 0; i < results.data.length; i++){
              var sermon = new SermonObj();
              sermon.loadSermon(results.data[i])
              self.sermons.push(sermon);
            }

      			tableState.pagination.numberOfPages = results.pageCount;
          });


      	};

      }

      return (sermonTable);
  }

})();

(function(){
  'use strict';

    SermonsService.$inject = ["$http", "$window"];
  angular
    .module('churchSite')
    .service('SermonsService', SermonsService)

    function SermonsService($http, $window){

      var service = this;

      service.getSermons = function(params){
    		return $http.get("/sermons/retrieveSermons", {params: params} ).then(function(response){
            return response.data;
          });
    		};

        service.getSermon = function(id){
      		return $http.get("/sermons/getSermon",
      				{params: { id: id} }
      			).then(function(response){
                return response.data;
              });
      	};


      	service.addSermon = function(fd){
      		return  $http.post("/sermons/uploadSermon",fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
              }).then(function(response){
                  return response.data;
                });
      	};

      	service.deleteSermon = function(id){
      		return $http.post("/sermons/removeSermon", { params: { id: id} }).then(function(response){
              return response.data;
            });
      	}

      	service.editSermon = function(fd){
      		return  $http.put("/sermons/updateSermon",fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
              }).then(function(response){
                  return response.data;
                });
      	};
    }

})();
