var express = require('express');
var router = express.Router();
var fs = require("fs");
var mongoose = require("mongoose");
var Sermon = require("../schema/sermon");
var shortId = require("shortid");

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('admin/home', { title: 'Express' });
});

router.post('/uploadSermon', function(req, res, next){
	var dirname = require('path').dirname(__dirname);
	var gridfs = req.app.get('gridfs');
  console.log("Uploading sermon...");

	if (Object.keys(req.files).length) {

		console.log(req.files);
		var files = req.files;

		if (files == null) {

			res.status(500);
			res.send("Please select a file...");

		}else{
			for(var fileNumber in files){

				if(files.hasOwnProperty(fileNumber)){

					var uploadedFile = files[fileNumber];

					fs.exists(uploadedFile.path, function(exists) {
						if(exists) {
							var extension = req.files.file.path.split(/[. ]+/).pop();
							var is,os;
							var uniqueFileName = shortId.generate() + '.' + extension;
							is = fs.createReadStream(req.files.file.path);
							os = gridfs.createWriteStream({
								filename: uniqueFileName
							});

							is.pipe(os);

							os.on('close', function (file) {
								//delete file from upload temp folder
								fs.unlink(req.files.file.path, function() {

									var newSermon = new Sermon(
											{
												title: req.body.title,
												description: req.body.description,
												date: req.body.date,
												audioFile: uniqueFileName,
												pastor: req.body.pastor,
												title_kr: req.body.title_kr,
												description_kr: req.body.description_kr
											}
									);

									newSermon.save(function (err, newSculpture) {
										if (err) return console.error(err);
										res.sendStatus(200);
									});
								})
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
	Sermon.findOneAndRemove({_id: req.body.params.id}, function(err, sermon){

		var gridfs = req.app.get('gridfs');

		gridfs.remove({ filename: sermon.audioFile }, function(err){
			if (err){
				res.sendStatus(500);
			}else{
				res.sendStatus(200);
			}
		});
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
  var gridfs = req.app.get('gridfs');

	if (Object.keys(req.files).length) {
		var files = req.files;
		if (files != null) {
			for(var fileNumber in files){
				if(files.hasOwnProperty(fileNumber)){
					var uploadedFile = files[fileNumber];
					fs.exists(uploadedFile.path, function(exists) {
						if(exists) {
							var extension = req.files.file.path.split(/[. ]+/).pop();
							var is,os;
							var uniqueFileName = shortId.generate() + '.' + extension;
							is = fs.createReadStream(req.files.file.path);
							os = gridfs.createWriteStream({
								filename: uniqueFileName
							});

							is.pipe(os);

							os.on('close', function (file) {
								//delete file from upload temp folder
								fs.unlink(req.files.file.path, function() {

									Sermon.findOne({_id: req.body.id}, function(err, event){
										console.log(err);

										gridfs.remove({ filename: event.audioFile }, function(err){
											if(err){
												res.send(500);
											}else{
												Sermon.update({_id : new ObjectId(req.body.id)}, {title: req.body.title,
													description: req.body.description,
													date: req.body.date,
													audioFile: sermonAudioName,
													pastor: req.body.pastor,
													title_kr: req.body.title_kr,
													description_kr: req.body.description_kr,
													audioFile: uniqueFileName},
													function(){
														if (err) return console.error(err);
														res.send(200);
													});
											}
										});
									});
								})
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
