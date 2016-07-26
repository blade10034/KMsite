var express = require('express');
var router = express.Router();
var Event = require('../schema/event');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/home', { title: 'Express' });
});

router.get('/getMonthEvents', function(req, res, next) {
	var year = req.query.year;
	var month = req.query.month;
	
	var start = new Date(year, month, 1);
	var end = new Date(year, month, 31);
	console.log(start);
	console.log(end);
	
	Event.find({date: {$gte: start, $lt: end}}).sort({date: 1}).exec(function(err, events){
		if(err){
			console.log(err);
		}else{
			console.log(events);
			var calendarEventFormatEvents = {};
			for(var i = 0; i < events.length; i++){
				var sameDayEvents = [];
				sameDayEvents.push(events[i]);
				
				for(var j = i + 1; j < events.length; j++){
					if(events[i].date.getDate() == events[i + 1].date.getDate()){
						sameDayEvents.push(events[j]);
						i = j;
					}
				}
				
				calendarEventFormatEvents[events[i].date.getUTCFullYear() + '-' + (events[i].date.getUTCMonth()+1) + '-' + events[i].date.getUTCDate()] = 
					{
						events: sameDayEvents 
					};
			}
			res.send(calendarEventFormatEvents);
		}
	});
});

router.get('/getDayEvents', function(req, res, next) {
	var eventDate = req.query.date;
	console.log(eventDate);
	Event.find({date: eventDate}, function(err, events){
		res.send(events);
	});
});

router.get('/getEvent:id?', function(req, res, next) {
	console.log(req.query.id);
	var eventId = req.query.id;
	Event.findOne({_id: eventId}, function(err, event){
		console.log(event);
		res.send(event);
	});
});

router.post('/createEvent', function(req, res, next){
	var eventData = req.body;
	
	var event = new Event(eventData);
	event.save(function(err){
		res.sendStatus(200);
	});
	
	
});

router.put('/updateEvent', function(req, res, next){
	var eventData = req.body;
	console.log(eventData);
	
	Event.findOneAndUpdate({_id: eventData._id}, eventData, function(err, event){
		res.sendStatus(200);
	});
});

router.delete('/deleteEvent:id?', function(req, res, next){
	Event.findOneAndRemove({_id: req.query.id}, function(err, event){
		res.sendStatus(200);
	});
});

module.exports = router;

