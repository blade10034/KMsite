(function(){
  'use strict';

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
