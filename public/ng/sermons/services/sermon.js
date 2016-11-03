(function(){
  'use strict';

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
