var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gallerySchema = new Schema({
        title: String,
		title_kr: String,
        imgFile: String,
        date: { type: Date, default: Date.now }
});

gallerySchema.statics.getGallery = function(db, page, process){
	var self = this;
	self.count({}, function(err, count){
		self.find().sort({date: 'ascending'}).skip(11 * (parseInt(page) - 1)).limit(12).exec(function(err, photos){
			if (err) return err;
			var totalPages = Math.floor(count/12) + (count/12 > Math.floor(count/12) ? 1 : 0);
			
			var pages = [];
			
			if(totalPages < 10){
				for(var i = 1; i <= totalPages; i++){
					pages.push(i);
				}
			}else if(page < 5){
				for(var i = 1; i <= 9; i++){
					pages.push(i);
				}
			}else{
				for(var i = page - 4; i <= (page + 4 <= totalPages) ? page + 4 : totalPages; i++){
					pages.push(i);
				}
			}
			
			process(photos, pages);
		});
	});
};

var Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
