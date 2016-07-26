var express = require('express');
var router = express.Router();
var Event = require('../schema/event');
var fs = require("fs");
var mongoose = require("mongoose");
var Gallery = require("../schema/gallery");
var Album = require("../schema/album");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/home', { title: 'Express' });
});

router.get('/getGalleryList:page?', function(req, res, next) {
	Gallery.getGallery(req.query.page, function(photos, pages){
		var prev = req.query.page != 1;
		var next = photos.length > 11;
		res.render('photosList', {photos: photos, pages: pages, prev: prev, next: next, currPage: req.query.page});
	  });
});

router.delete('/removeAlbum', function(req, res, next){
	var albumId = req.body.id;
	
	Album.removeAlbum(albumId, function(err, album){
		if(err){
			console.log(err);
			res.send(500);
		}else{
			res.send(200);
		}
	});

});

router.delete('/removePhoto', function(req, res, next){
	var albumId = req.body._id;
	var photo = req.body.photo;
	
	Album.removePhoto(albumId, photo, function(err, album){
		if(err){
			console.log(err);
			res.send(500);
		}else{
			res.json(album);
		}
	});

});

router.post('/uploadPhoto:albumId?', function(req, res, next){
        var dirname = require('path').dirname(__dirname);
		
		if (Object.keys(req.files).length) {
				var files = req.files;
				var filesArray = [];
				
				for(var fileNumber in files){
					if(files.hasOwnProperty(fileNumber)){
						filesArray.push(files[fileNumber]);
					}
				}
				if (files != null) {
					console.log(filesArray);
					Album.addPhotos(req.query.albumId, filesArray, function(err, album){
						if(err){
							console.log(err);
							res.send(500);
						}else{
							res.json(album);
						}
						
					});
				}
		}else{
			res.status(500);
			res.send("Please select a file...");
		}
});

router.post('/removePhoto:id?', function(req, res, next){
	var dirname = require('path').dirname(__dirname);
	
	Gallery.findOneAndRemove({_id: req.query.id}, function(err, photo){
		var filename = dirname + '/public/gallery/' + photo.imgFile;
		fs.unlink(filename);
		res.sendStatus(200);
	});
});

router.post("/updateAlbumTitle", function(req, res ,next){
	var ObjectId = require('mongoose').Types.ObjectId;
	
	if(req.body.title == "" || req.body.title == undefined){
		res.sendStatus(500);
	}else{
		Album.update( {_id : new ObjectId(req.body._id)}, {title: req.body.title}, function(err, numAffected){
			if(err){
				res.sendStatus(500);
			}else{
				res.sendStatus(200);
			}
		});
	}

});

module.exports = router;

