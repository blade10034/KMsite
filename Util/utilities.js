module.exports = function(app){

  var gridfs = app.get('gridfs');

  return {
    deleteFromGrid: function(filename, callback){
    		gridfs.remove({ filename: fileName }, function(err){
          callback(err);
    		});
    }
  }
}
