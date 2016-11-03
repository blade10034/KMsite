(function(){
  'use strict';

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
