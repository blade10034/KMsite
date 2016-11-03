(function(){
  'use strict';

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
