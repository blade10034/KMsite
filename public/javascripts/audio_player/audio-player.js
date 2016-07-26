var AudioPlayer = function(init){
	var self = this;
	
	self.outerAudioContainer = init.container;
	self.audioPlayerHandleBars = Handlebars.compile($("#" + self.audioPlayerTemplate).html());
	
	if(init.onPlay){
		self.onPlay = init.onPlay;
	}
	
	if(init.onPause){
		self.onPause = init.onPause;
	}
	
	if(init.audioFile){
		self.setAudioFile(init.audioFile, false);
	}
};

AudioPlayer.prototype = {
	currentAudioFile: "",
	totalTimeDisplay: "total-time",
	currentTimeDisplay: "current-time",
	audioPlayerTemplate: "audioPlayerTemplate",
	hiddenAudioPlayer: "hidden-audio-player",
	audioPlayerController: {},
	audioPlayerHandleBars: {}, 
	outerAudioContainer: "",
	innerAudioContainer: "audio-player-container",
	playButton: "play-audio",
	pauseButton: "pause-audio",
	timeSlider: "time-slider",
	playPauseContainer: "play_pause",
	setAudioFile: function(audioFile, playOnLoad){
		var self = this;
		
		if($("#time-slider").length){
			self.pauseAudio();
			$("#time-slider").slider("destroy");
		}
		
		self.currentAudioFile = audioFile;
		
		$("#" + self.outerAudioContainer).html(self.audioPlayerHandleBars({ audioFile: "/sermon_audio/" + audioFile }));
		
		self.audioPlayerController = document.getElementById(self.hiddenAudioPlayer);
		
		self.audioPlayerController.addEventListener("timeupdate", function(event){
			self.updateTime();
		});
		
		self.audioPlayerController.addEventListener("loadeddata", function(){
			var durationAudio = self.audioPlayerController.duration * 1000;
			if(durationAudio > 3600000){
				$("#" + self.totalTimeDisplay).html(moment.duration(durationAudio, "milliseconds").format('h:mm:ss', { trim: false }));
			}else{
				$("#" + self.totalTimeDisplay).html(moment.duration(durationAudio, "milliseconds").format('mm:ss', { trim: false }));
			}
			
			
			$("#" + self.playButton).on("click", function(){
				self.playAudio();
			});
			
			$("#" + self.pauseButton).on("click", function(){
				self.pauseAudio();
			});
			
			$("#" + self.timeSlider).slider({
				range: "min",
				min: 0,
				max: durationAudio,
				value: 0,
				change: function(event, ui){
					if(event.originalEvent){
						self.audioPlayerController.currentTime = Math.floor(ui.value / 1000);
					}
				},
				slide: function(event, ui){
					if(event.originalEvent){
						self.audioPlayerController.currentTime = Math.floor(ui.value / 1000);
					}
				},
				create: function(event, ui){
					if(playOnLoad){
						self.playAudio();
					}
				}
			});
		});
		
	},
	updateTime: function(){
		var self = this;
		
		if($("#" + self.timeSlider).slider("instance") != undefined){
			$("#" + self.timeSlider).slider("value", self.audioPlayerController.currentTime * 1000);
		}
		
		var currTime = self.audioPlayerController.currentTime * 1000;
		
		if(currTime > 3600000){
			$("#" + self.currentTimeDisplay).html(moment.duration(currTime, "milliseconds").format('h:mm:ss', { trim: false }));
		}else{
			$("#" + self.currentTimeDisplay).html(moment.duration(currTime, "milliseconds").format('mm:ss', { trim: false }));
		}
	},
	playAudio: function() {
		var self = this;
		self.audioPlayerController.play();
		$("#" + self.playPauseContainer).addClass("playing");
		
		self.onPlay();
	},
	pauseAudio: function() {
		var self = this;
		self.audioPlayerController.pause();
		$("#" + self.playPauseContainer).removeClass("playing");
		
		self.onPause();
	},
	onPlay: function(){
	},
	onPause: function(){
	}
};