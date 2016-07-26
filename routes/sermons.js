var express = require('express');
var router = express.Router();
var fs = require("fs");
var mongoose = require("mongoose");
var Sermon = require("../schema/sermon");


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('admin/home', { title: 'Express' });
});

router.post('/uploadSermon', function(req, res, next){
	var dirname = require('path').dirname(__dirname);
    console.log("Uploading sermon...");
    
	if (Object.keys(req.files).length) {
		console.log("Got in here...");
		console.log(req.files);
		var files = req.files;

		if (files == null) {
			
			res.status(500);
			res.send("Please select a file...");
			
		}else{
			for(var fileNumber in files){
				
				console.log("now looping...");
				
				if(files.hasOwnProperty(fileNumber)){
					
					var uploadedFile = files[fileNumber];
					
					fs.exists(uploadedFile.path, function(exists) {
						if(exists) {
							var filename = uploadedFile.name;
							var path = uploadedFile.path;
							
							console.log(path);
							var type = uploadedFile.mimetype;

							var sermonAudioName = uploadedFile.name;

							fs.rename(dirname + '\\bin\\' + uploadedFile.path, dirname + '\\public\\sermon_audio\\' + sermonAudioName, function(err){
								
								if (err) console.log(err);
								
								var newSermon = new Sermon(
										{
											title: req.body.title, 
											description: req.body.description, 
											date: req.body.date, 
											audioFile: sermonAudioName,
											pastor: req.body.pastor,
											title_kr: req.body.title_kr,
											description_kr: req.body.description_kr
										}
								);
								
								newSermon.save(function (err, newSculpture) {
									if (err) return console.error(err);
									res.send(200);
								});
								
							});
						} else {
							return next(new Error("Failed...try again."));
						}
					});
				}
			}
		}
	}else{
		
		res.status(500);
		res.send("No files");
		
	}
});

router.post('/removeSermon', function(req, res, next){
	var dirname = require('path').dirname(__dirname);
	
	console.log(req.body);
	
	Sermon.findOneAndRemove({_id: req.body.params.id}, function(err, sermon){
		console.log("Sermon: " + sermon);
		var filename = dirname + '\\public\\sermon_audio\\' + sermon.audioFile;
		console.log(filename);
		fs.unlink(filename);
		res.sendStatus(200);
	});
});

router.get('/getSermon:id?', function(req, res, next){
	Sermon.findOne({_id: req.query.id}, function(err, sermon){
		console.log(err);
		res.json(sermon);
	});
});

router.put('/updateSermon', function(req, res, next){
	var dirname = require('path').dirname(__dirname);
	var ObjectId = require('mongoose').Types.ObjectId;
	if (Object.keys(req.files).length) {
		console.log(req.files);
		var files = req.files;
		if (files != null) {
			for(var fileNumber in files){
				if(files.hasOwnProperty(fileNumber)){
					var uploadedFile = files[fileNumber];
					fs.exists(uploadedFile.path, function(exists) {
						if(exists) {
							var filename = uploadedFile.name;
							var path = uploadedFile.path;
							var type = uploadedFile.mimetype;

							var sermonAudioName = req.body.title + "_" + uploadedFile.name;
							fs.rename(dirname + '\\bin\\' + uploadedFile.path, dirname + '\\public\\sermon_audio\\' + sermonAudioName, function(err){
								if (err) console.log(err);

								Sermon.findOne({_id: req.body.id}, function(err, event){
									console.log(err);
									var filename = dirname + '\\public\\sermon_audio\\' + event.audioFile;
									console.log(filename);
									fs.unlink(filename);

									Sermon.update({_id : new ObjectId(req.body.id)}, {title: req.body.title, 
										description: req.body.description, 
										date: req.body.date, 
										audioFile: sermonAudioName,
										pastor: req.body.pastor,
										title_kr: req.body.title_kr,
										description_kr: req.body.description_kr}, 
										function(){
											if (err) return console.error(err);
											res.send(200);
										});
								});
							});
						} else {
							return next(new Error("Failed...try again."));
						}
					});
				}
			}
		}
	}else{
		console.log(req.body);
		Sermon.update({_id : new ObjectId(req.body.id)}, {
			title: req.body.title, 
			description: req.body.description, 
			date: req.body.date,
			pastor: req.body.pastor,
			title_kr: req.body.title_kr,
			description_kr: req.body.description_kr}, 
			function(err, data){
				if (err) return console.error(err);
				res.status(200).send("Good...");
			});
	}
});

router.get('/retrieveSermons', function(req, res, next){
	
	var sermonQuery = {};
	
	if(req.query.searchTerm){
		var regex = ".*" + req.query.searchTerm + ".*";
		sermonQuery['$or'] = [{ title: {$regex : regex, $options: '-i'} }, { pastor: {$regex : regex, $options: '-i'} }, { description: {$regex : regex, $options: '-i'} } ];
	}
	
	if(req.query.sortPredicate){
		var sortOrder = req.query.sortOrder == 'ascending' ? -1 : 1;
		var sortObj = {};
		sortObj[req.query.sortPredicate] = sortOrder;
		
		Sermon.find(sermonQuery).sort(sortObj).skip(req.query.pageStart).limit(5).exec(function(err, sermons){
			Sermon.count(sermonQuery).exec(function(err, count){
				var results = { data: sermons, pageCount: Math.ceil(count / 5)}
				res.json(results);
			});
		});
	}else{
		Sermon.find(sermonQuery).sort({date: -1}).skip(req.query.pageStart).limit(5).exec(function(err, sermons){
			Sermon.count(sermonQuery).exec(function(err, count){
				var results = { data: sermons, pageCount: Math.ceil(count / 5)}
				res.json(results);
			});
		});
	}
});

module.exports = router;

