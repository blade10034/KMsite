var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
        title: String,
		title_kr: String,
        description: String,
		description_kr: String,
        date: Date,
		fromTime: {
			hour: String,
			minute: String,
			period: String
		},
		toTime: {
			hour: String,
			minute: String,
			period: String
		}
});

eventSchema.statics.getComingUpEvents = function(db, process){
	var currDate = new Date().toISOString();
	
	this.find({"date" : { "$gte" : currDate }}).sort({date: 'ascending'}).limit(6).exec(function(err, events){
		if (err) return err;
		process(events);
	});
};

eventSchema.statics.getMonthText = function(month){
	switch(month){
		case 0:
			return 'Jan';
			break;
		case 1:
			return 'Feb';
			break;
		case 2:
			return 'Mar';
			break;
		case 3:
			return 'Apr';
			break;
		case 4:
			return 'May';
			break;
		case 5:
			return 'June';
			break;
		case 6:
			return 'July';
			break;
		case 7:
			return 'Aug';
			break;
		case 8:
			return 'Sept';
			break;
		case 9:
			return 'Oct';
			break;
		case 10:
			return 'Nov';
			break;
		case 11:
			return 'Dec';
			break;
	}

}

eventSchema.statics.getMonthKRText = function(month){
	switch(month){
		case 0:
			return '일월';
			break;
		case 1:
			return '이월';
			break;
		case 2:
			return '삼월';
			break;
		case 3:
			return '사월';
			break;
		case 4:
			return '오월';
			break;
		case 5:
			return '유월';
			break;
		case 6:
			return '칠월';
			break;
		case 7:
			return '팔월';
			break;
		case 8:
			return '구월';
			break;
		case 9:
			return '시월';
			break;
		case 10:
			return '십일월';
			break;
		case 11:
			return '십이월';
			break;
	}

}

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;

