(function(){
  'use strict';

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
