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

module.exports = router;
