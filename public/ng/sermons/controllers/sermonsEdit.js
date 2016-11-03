(function(){
  'use strict';

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
