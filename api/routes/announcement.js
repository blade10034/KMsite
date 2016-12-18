var express = require('express');
var router = express.Router();
var Event = require('../schema/event');
var fs = require("fs");
var mongoose = require("mongoose");
var Announcement = require("../schema/announcement");

/**
 * Update the front end announcement
 */
router.post('/edit', function(req, res, next) {
	var newAnnouncement = new Announcement({announcement: req.body.announcementEdit, announcement_kr: req.body.announcementEdit_kr, date: new Date()});
	
	newAnnouncement.save(function (err, newAnnouncement) {
		 if (err) 
			 return console.error(err);
		 
		 res.redirect('/admin');
	});
});

module.exports = router;

