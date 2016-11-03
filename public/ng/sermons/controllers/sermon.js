(function(){
  'use strict';

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
