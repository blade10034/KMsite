angular.module('sermons', ['ngMaterial',
                        'ngMessages',
                        'ngSanitize',
               			'com.2fdevs.videogular',
            			'com.2fdevs.videogular.plugins.controls',
            			'com.2fdevs.videogular.plugins.overlayplay',
            			'com.2fdevs.videogular.plugins.poster',
            			'smart-table',
            			'ngConfirm',
            			'ui.bootstrap']);

angular.module('sermons').service('sermonSvc', function($http, $window){

	this.getSermons = function(params){
		return $http.get("/sermons/retrieveSermons",
				{params: params}
			);
		};

	this.getSermon = function(id){
		return $http.get("/sermons/getSermon",
				{params: { id: id} }
			);
	};


	this.addSermon = function(fd){
		return  $http.post("/sermons/uploadSermon",fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
	};

	this.deleteSermon = function(id){
		return $http.post("/sermons/removeSermon", { params: { id: id} });
	}

	this.editSermon = function(fd){
		return  $http.put("/sermons/updateSermon",fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
	};

});

angular.module('sermons').controller('SermonsController', function($scope, sermonSvc){
	$scope.sermonTitle = "Sermons";

});

angular.module('sermons').controller('SermonsMainController', function($scope, $window, sermonSvc){

	$scope.callServer = function(tableState){
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

		var getAllSermons = sermonSvc.getSermons(parameters);

		getAllSermons.success(function(results, status, headers, config){
			$scope.sermons = results.data;
			tableState.pagination.numberOfPages = results.pageCount;
		});

		getAllSermons.error(function(data,status,headers,config){
			$scope.sermons = [];
		});
	};

});


angular.module('sermons').controller('SermonsAdminController', function($scope, $window, $route, sermonSvc){

	$scope.callServer = function(tableState){
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

		var getAllSermons = sermonSvc.getSermons(parameters);

		getAllSermons.success(function(results, status, headers, config){
			$scope.sermons = results.data;
			tableState.pagination.numberOfPages = results.pageCount;
		});

		getAllSermons.error(function(data,status,headers,config){
			$scope.sermons = [];
		});
	};


	$scope.deleteSermon = function(id){

		var deleteFunction = sermonSvc.deleteSermon(id);

		deleteFunction.success(function(results, status, headers, config){
			$window.alert("Sermon deleted.");
			$route.reload();
		});

	}



});


angular.module('sermons').controller('SermonAudioPlayer',
		["$sce", function ($sce) {
			var controller = this;

			controller.API = null;
			controller.audioId = null;

			controller.onPlayerReady = function(API) {
				controller.API = API;
			};

			controller.onChangeSource = function(source){
				controller.API.play();
			}


			controller.config = {
				sources: [],
				theme: "bower_components/videogular-themes-default/videogular.css"
			};

			controller.setAudio = function(id, audioFile){
				if(id === controller.audioId){
					controller.API.playPause();
				}else{
					controller.API.stop();
					controller.config.sources = [{ src: $sce.trustAsResourceUrl("/sermon_audio/" + audioFile), type: "audio/mp3"}];
					controller.audioId = id;
				}
			};

			controller.checkAudioId = function(id){
				return id === controller.audioId;
			};

			controller.isPlaying = function(){
				return controller.API.currentState == 'play';
			};

			controller.isPaused = function(){
				return controller.API.currentState == 'pause' || controller.API.currentState == 'stop' ;
			};
		}]
	);

angular.module('sermons').controller('SermonsAddController', function($scope, $location, $window, sermonSvc){
	$scope.title = "";
	$scope.title_kr = "";
	$scope.pastor = "";
	$scope.date = new Date();
	$scope.description = "";
	$scope.description_kr = "";
	$scope.pastor_kr = "";

	$scope.addSermon = function(){
		var file = $scope.audioFile;
        var fd = new FormData();
        fd.append('file', file);
        fd.append('title', $scope.title);
        fd.append('title_kr', $scope.title_kr );
        fd.append('pastor', $scope.pastor );
        fd.append('date', $scope.date);
        fd.append('description', $scope.description);
        fd.append('description_kr', $scope.description_kr);
        fd.append('pastor_kr', $scope.pastor_kr);

		var addASermon = sermonSvc.addSermon(fd);

		addASermon.success(function(data, status, headers, config){
			$location.path('#/admin/sermons');
		});

	}
});


angular.module('sermons').controller('SermonsEditController', function($scope, $location, $routeParams, sermonSvc){

	var getSermon = sermonSvc.getSermon($routeParams.sermonId);

	getSermon.success(function(result, status, headers, config){
		$scope.id = result._id;
		$scope.title = result.title;
		$scope.title_kr = result.title_kr;
		$scope.pastor = result.pastor;
		$scope.date = new Date(result.date);
		$scope.description = result.description;
		$scope.description_kr = result.description_kr;
		$scope.pastor_kr = result.pastor_kr;
	});

	$scope.editSermon = function(){
		var file = $scope.audioFile;
        var fd = new FormData();
        fd.append('id', $scope.id);
        fd.append('file', file);
        fd.append('title', $scope.title);
        fd.append('title_kr', $scope.title_kr );
        fd.append('pastor', $scope.pastor );
        fd.append('date', $scope.date);
        fd.append('description', $scope.description);
        fd.append('description_kr', $scope.description_kr);
        fd.append('pastor_kr', $scope.pastor_kr);

		var editASermon = sermonSvc.editSermon(fd);

		editASermon.success(function(data, status, headers, config){
			$location.path('/admin/sermons');
		});

	}
});
