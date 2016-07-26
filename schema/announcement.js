var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var announcementSchema = new Schema({
        announcement: String,
		announcement_kr: String,
		date: Date
});

var Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
