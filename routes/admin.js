var express = require('express');
var router = express.Router();
var Sermon = require('../schema/sermon');
var Album = require('../schema/album');
var Announcement = require('../schema/announcement');

/**
 *  Get the admin main page (render announcement functionality) 
 *  
 *  */
router.get('/', function(req, res, next) {
  Announcement.findOne().sort({date: -1}).exec(function(err, announcement){
		if(announcement === null)
			announcement = {announcement: "New announcement...", announcement_kr: "New announcement..." };
		
		res.render('admin/index', {announcement: announcement.announcement, announcement_kr: announcement.announcement_kr });
	});
});

/**
 * Get the calendar events admin page
 * 
 */
router.get('/events', function(req, res, next) {
  res.render('admin/events');
});


/**
 * Get the sermons admin page
 * 
 */
router.get('/sermons:page?', function(req, res, next) {
  var pageNum = (req.query.page === undefined) ? 1 : req.query.page;
	
  Sermon.getSermons(req.db, pageNum, function(sermons, pages){
	res.render('admin/sermons', {sermons: sermons, pages: pages, prev: pageNum !== 1, next: sermons.length > 6, currPage: pageNum});
  });
});


/**
 * Get the main photo gallery admin page
 * 
 */
router.get('/gallery:page?', function(req, res, next) {
  var pageNum = (req.query.page === undefined) ? 1 : req.query.page;
	
  Album.getGallery(pageNum, function(albums, pages){
	res.render('admin/gallery', {albums: albums, pages: pages, prev: pageNum !== 1, next: albums.length > 11, currPage: pageNum});
  });
});

/**
 * Get a specific album admin page
 * 
 */
router.get('/album:id?', function(req, res, next) {
	var ObjectId = require('mongoose').Types.ObjectId; 

	Album.findOne({ _id : new ObjectId(req.query.id) }).exec(function(err, album){
		res.render('admin/album', {album: album});
	});
});


/**
 * Create a brand new album
 * 
 */
router.post('/addAlbum', function(req, res, next) {
	var newAlbum = new Album({title: "New title...", title_kr: "New korean title..."});
	newAlbum.save(function(err, album){
		res.send(album.id);
	});
});

/**
 * Send to the newsletter admin page
 * 
 */
router.get('/newsletter', function(req, res, next) {
  res.render('admin/newsletter');
});


module.exports = router;

