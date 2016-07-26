var express = require('express');
var router = express.Router();
var Event = require('../schema/event');
var Sermon = require("../schema/sermon");
var Gallery = require("../schema/gallery");
var Announcement = require("../schema/announcement");
var Album = require("../schema/album");

/* GET home page. */
router.get('/', function(req, res, next) {
  
  var lang = req.cookies.language;	
  console.log(lang);
  res.render('angular/home/index');
  /*if(lang == undefined){
	  console.log('here');
	  res.render('home/chooseLanguage');
  }else{
	  console.log('no here');
	  res.redirect('/home');
  }*/

});

router.get('/home', function(req, res, next) {
	  Event.getComingUpEvents(req.db, function(events){
			var displayEvents = [];
			
			for( var i = 0; i < events.length; i++){
				var event ={
					title: events[i].title,
					title_kr: events[i].title_kr,
					month: Event.getMonthText(events[i].date.getUTCMonth()),
					month_kr: Event.getMonthKRText(events[i].date.getUTCMonth()),
					day: events[i].date.getUTCDate(),
					uri: '/event?date=' + events[i].date.getUTCFullYear() + '-' + events[i].date.getUTCMonth() + '-' + events[i].date.getUTCDate(),
					timeRange: events[i].fromTime.hour + ':' + events[i].fromTime.minute + ' ' + events[i].fromTime.period + '-' + events[i].toTime.hour + ':' + events[i].toTime.minute + ' ' + events[i].toTime.period,
					description: events[i].description,
					description_kr: events[i].description_kr
				};
				
				displayEvents.push(event);
			}
		    
			
			Sermon.getLatestSermon(req.db, function(sermon){
				Announcement.findOne().sort({date: -1}).exec(function(err, announce){
					if(announce === null)
						announce = {announcement: "None", announcement_kr: "None", date: new Date()};
					
					res.render('index', { title: 'New Life Presbytarian', events: displayEvents, sermon: sermon, announcement: announce });
				});
			});
		  });
});

router.get('/setLang:lang?', function(req, res, next) {
	var lang = req.query.lang;
	
	if(lang != undefined){
		res.cookie('language', lang);
	}else{
		res.cookie('language', 'English');
	}
	
	res.send(200);
});

router.get('/events', function(req, res, next) {
  res.render('events/events');
});

router.get('/contact', function(req, res, next) {
  res.render('info/contact');
});

router.get('/angular/sermons:page?', function(req, res, next) {
  console.log(req.query.page);
  var pageNum = (req.query.page == undefined) ? 1 : req.query.page;
  
  Sermon.getSermons(req.db, pageNum, function(sermons, pages){
	var next = sermons.length > 9;
	if(next){
		sermons.splice(10, 1);
	}
	var prev = pageNum != 1;
	res.render('angular/sermons/sermons', {sermons: sermons, pages: pages, prev: prev, next: next, currPage: pageNum});
  });
});

router.get('/info', function(req, res, next) {
  res.render('info/info');
});

router.get('/directions', function(req, res, next) {
  res.render('info/directions', {isTimeLocation: true});
});

router.get('/news', function(req, res, next) {
  res.render('newsletter/news');
});

router.get('/album:id?', function(req, res, next) {
	var ObjectId = require('mongoose').Types.ObjectId; 
	var albumId = req.query.id;
	Album.findOne({ _id : new ObjectId(albumId) }).exec(function(err, album){
		res.render('gallery/album', {album: album});
	});
});

router.get('/gallery:page?', function(req, res, next) {
  var pageNum = (req.query.page == undefined) ? 1 : req.query.page;
  
  Album.getGallery(pageNum, function(albums, pages){
	var next = albums.length > 11;
	var prev = pageNum != 1;
	res.render('gallery/gallery', {albums: albums, pages: pages, prev: prev, next: next, currPage: pageNum});
  });
});


module.exports = router;
