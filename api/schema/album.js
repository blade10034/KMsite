var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fs = require("fs");

var albumSchema = new Schema({
        title: String,
		title_kr: String,
        photos: [String],
        date: { type: Date, default: Date.now }
});

albumSchema.statics.removeAlbum = function(albumId, cb){
	var self = this;
	var dirname = require('path').dirname(__dirname);
	var photoDir = dirname + "/public/gallery/";
	
	var ObjectId = require('mongoose').Types.ObjectId;
	console.log(albumId);
	Album.findOne({ _id: new ObjectId(albumId)}, function(err, album){
		
		if(err) cb(err);
		
		console.log(album);
		for(var i = 0; i < album.photos.length; i++){
			fs.unlinkSync(photoDir + album.photos[i]);
		}
		
		Album.findOneAndRemove({ _id: new ObjectId(albumId)}, function(err, album){
			if(err) cb(err);
			
			cb(0, album);
		});
	});
};

albumSchema.statics.removePhoto = function(albumId, photo, cb){
	var self = this;
	var dirname = require('path').dirname(__dirname);
	var photoDir = dirname + "/public/gallery/";
	
	var ObjectId = require('mongoose').Types.ObjectId;
	console.log(albumId);
	Album.findOneAndUpdate({ _id: new ObjectId(albumId)}, {$pull: {photos: photo}}, function(err, album){
		
		if(err) cb(err);
		
		fs.unlinkSync(photoDir + photo);
		cb(0, album);
	});

};

albumSchema.statics.addPhotos = function(albumId, photos, cb){
	var self = this;
	var dirname = require('path').dirname(__dirname);
	
	if(photos.length){
		var uploadedFile = photos.shift();
		
		fs.exists(uploadedFile.path, function(exists) {
			if(exists) {
				var filename = uploadedFile.name;
				var path = uploadedFile.path;
				var type = uploadedFile.mimetype;
			
				//var photoName = req.body.title.replace(/ /g, "_") + "_" + uploadedFile.name;
				var photoName = uploadedFile.name;
				fs.rename(dirname + '/' + uploadedFile.path, dirname + '/public/gallery/' + photoName, function(err){
					if (err) cb(err);
					
					self.addPhoto(albumId, photoName, function(err){
						if(err) cb(err);
						
						if(photos.length){
							self.addPhotos(albumId, photos, cb);
						}else{
							var ObjectId = require('mongoose').Types.ObjectId;
							
							Album.findOne( { _id: new ObjectId(albumId)}, function(err, album){
								cb(0, album)
							});
						}
					});
					
				});
			}else {
				return next(new Error("Failed...try again."));
			}
		});
	}else{
		cb("Nothing sent...");
	}
};

albumSchema.statics.addPhoto = function(albumId, photoName, cb){
	var ObjectId = require('mongoose').Types.ObjectId;
	
	Album.findOneAndUpdate({ _id: new ObjectId(albumId)}, {$push: {photos: photoName}}, function(err, album){
		cb(err);
	});
};

albumSchema.statics.getGallery = function(page, process){
	var self = this;
	self.count({}, function(err, count){
		self.find().sort({date: 'ascending'}).skip(11 * (parseInt(page) - 1)).limit(12).exec(function(err, albums){
			if (err) return err;
			var totalPages = Math.floor(count/12) + (count/12 > Math.floor(count/12) ? 1 : 0);
			
			var pages = [];
			
			if(totalPages < 10){
				for(var i = 1; i <= totalPages; i++){
					pages.push(i);
				}
			}else if(page < 5){
				for(var i = 1; i <= 9; i++){
					pages.push(i);
				}
			}else{
				for(var i = page - 4; i <= (page + 4 <= totalPages) ? page + 4 : totalPages; i++){
					pages.push(i);
				}
			}
			
			process(albums, pages);
		});
	});
};

var Album = mongoose.model('Album', albumSchema);

module.exports = Album;
