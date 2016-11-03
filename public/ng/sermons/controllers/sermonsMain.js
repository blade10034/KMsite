(function(){
  'use strict';

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
