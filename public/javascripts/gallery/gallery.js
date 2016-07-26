var PhotoViewer = function(photos){
	var self = this;
	self.count = photos.length;
	self.photos = photos;
	if(photos.length > 0){
		this.curImg = this.urlPre + photos[0];
	}

	self.numPanels = Math.ceil(self.count / self.maxPanelSize);
	$(self.nextPanelSelector).on("click", function(){
		self.nextPanel();
	});

	$(self.prevPanelSelector).on("click", function(){
		self.prevPanel();
	});
	
	$(self.prevPhotoSelector).on("click", function(){
		self.prevPhoto();
	});
	
	$(self.nextPhotoSelector).on("click", function(){
		self.nextPhoto();
	});
	
	for(var i = 0; i < self.maxPanelSize; i++){
		var thumbnail = $("#thumbnail" + i);
		
		$(thumbnail).on("click", function(){
			self.selectPhoto($(this).data("pos"));
		});
	}
	
	$("#total-photos").html(self.count);
	$("#cur-photo").html(1);
	
	this.refreshPanel();
	this.refresh();
};

PhotoViewer.prototype = {
	count: 0,
	selected: 0,
	curImg: "",
	maxPanelSize: 9,
	numRows: 3,
	numCols: 3,
	numPanels: 0,
	curPanel: 1,
	photos: [],
	urlPre: "/gallery/",
	selector: $("#photo-selector"),
	photoView: $("#photo-view"),
	nextPanelSelector: $("#photoSetNext"),
	prevPanelSelector: $("#photoSetPrev"),
	nextPhotoSelector: $("#photoNext"),
	prevPhotoSelector: $("#photoPrev"),
	thumbnailSize: 76,
	selectPhoto: function(photoNum){
		var self = this;
		
		self.selected = photoNum + (self.maxPanelSize * (self.curPanel - 1));
		self.refresh();
	},
	nextPhoto: function(){
		var self = this;
		if(self.selected < self.count - 1){
			self.selected++;
			self.refresh();
		}
	},
	prevPhoto: function(){
		var self = this;
		if(self.selected > 0){
			self.selected--;
			self.refresh();
		}
	},
	refresh: function(){
		var self = this;
		
		var panel = Math.ceil((self.selected + 1) / self.maxPanelSize);
		if(panel != self.curPanel){
			self.curPanel = panel;
			self.refreshPanel();
		}
		
		self.curImg = self.urlPre + self.photos[self.selected];
		self.photoView.attr("src", self.curImg);
		$("#cur-photo").html(self.selected + 1);
		self.moveSelector();
	},
	moveSelector: function(){
		var self = this;
		
		var pos = self.selected % self.maxPanelSize;
		var row = Math.floor(pos / self.numRows);
		var y = row * self.thumbnailSize;
		
		var col = pos - (row * self.numCols);
		var x = col * self.thumbnailSize;
		
		
		self.selector.css("left", x);
		self.selector.css("top", y);
	},
	nextPanel: function(){
		var self = this;
		if(self.curPanel < self.numPanels){
			self.curPanel += 1;
			self.selected = (self.curPanel - 1) * self.maxPanelSize;
			
			self.refreshPanel();
			self.refresh();
		}
		
	},
	prevPanel: function(){
		
		var self = this;
		
		if(self.curPanel > 1){
			self.curPanel -= 1;
			self.selected = (self.curPanel - 1) * self.maxPanelSize;
			
			self.refreshPanel();
			self.refresh();
		}
	},
	refreshPanel: function(){
		var self = this;
		
		var start = (self.curPanel - 1) * self.maxPanelSize;
		var end = start + self.maxPanelSize <= self.count - 1 ? start + self.maxPanelSize : self.count - 1; 
		
		for(var i = 0; i < self.maxPanelSize; i++){
			var thumbNail = $("#thumbnail" + i);
			if(i + start <= end){
				var url = self.urlPre + self.photos[i + start];
				$(thumbNail).css("background-image", "url(" + url + ")");
				$(thumbNail).css("display", ""); 
			}else{
				$(thumbNail).css("display", "none");
			}
		}
		self.refresh();
	}
};

