var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sermonSchema = new Schema({
        title: String,
		title_kr: String,
		description: String,
		description_kr: String,
        audioFile: String,
        date: Date,
		pastor: String,
		pastor_kr: String
});

sermonSchema.statics.getSermons = function(db, page, process){
	var self = this;
	self.count({}, function(err, count){
		self.find().sort({date: 'descending'}).skip(6 * (parseInt(page) - 1)).limit(7).exec(function(err, sermons){
			if (err) return err;
			var totalPages = Math.floor(count/7) + (count/7 > Math.floor(count/7) ? 1 : 0);
			
			var pages = [];
			
			if(totalPages < 10){
				for(var i = 1; i <= totalPages; i++){
					pages.push(i);
				}
			}else if(page < 5){
				for(var i = 1; i <= 6; i++){
					pages.push(i);
				}
			}else{
				for(var i = page - 4; i <= (page + 4 <= totalPages) ? page + 4 : totalPages; i++){
					pages.push(i);
				}
			}
			
			process(sermons, pages);
		});
	});
};

sermonSchema.statics.getAllSermons = function(process){
	var self = this;
	self.find().limit(10).exec(function(err, sermons){		
		process(err, sermons);
	});
};

sermonSchema.statics.getLatestSermon = function(db, process){
	this.find().sort({date: 'descending'}).limit(1).exec(function(err, sermons){
		if (err) return err;
		var sermon = sermons[0];
				
		process(sermon);
	});
};

var Sermon = mongoose.model('Sermon', sermonSchema);

module.exports = Sermon;
