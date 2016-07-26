function EventEditor(){
	var self = this;

	self.currentEditDate = "";
	self.events = [];
	self.modal = $("#editDay");
	self.eventsViewer = $("#eventsViewer");
	self.calendarView = $("#km-calendar");
	
	var templateEditSource = $("#EditEventTemplate").html();
	var templateSingleEditSource = $("#SingleEventTemplate").html();
	
	self.editEventTemplate = Handlebars.compile(templateEditSource);
	self.singleEventEdit = Handlebars.compile(templateSingleEditSource);
	
	$.editable.addInputType('event', {
		element: function(settings, original){
			var input = $('<input type="hidden">');
			$(this).append(input);
			return(input);
		},
		content: function(string, settings, original){
			var form = this;
			var eventId = $(original).data('eventid');
			$.get('/events/getEvent?id=' + eventId, function(eventData){
				var formInput = self.singleEventEdit(eventData);
				$(form).prepend(formInput);
				$("select",form).each(function(){
					$(this).val($(this).data('value'));
				});
				$($(original).parent()).addClass('single_event_expand');
				
			});
		},
		submit: function(settings, original){
			var updateEventData = {
				_id: $(original).data("eventid"),
				date: self.currentEditDate,
				title: $("#event_title_input").val(),
				title_kr: $("#event_title_kr_input").val(),
				description: $("#event_description_input").val(),
				description_kr: $("#event_description_kr_input").val(),
				fromTime: {
					hour: $("#event_fromTimeHour_input").val(),
					minute: $("#event_fromTimeMinute_input").val(),
					period: $("#event_fromTimePeriod_input").val()
				},
				toTime: {
					hour: $("#event_toTimeHour_input").val(),
					minute: $("#event_toTimeMinute_input").val(),
					period: $("#event_toTimePeriod_input").val()
				}
			};
			
			$("input", this).val(JSON.stringify(updateEventData));
			
		}
	});
}

EventEditor.prototype.initModal = function(date){
	var self = this;
	self.currentEditDate = date;
	self.updateEventDom();
};

EventEditor.prototype.updateCalendar = function(){
	var self = this;
	self.calendarView.responsiveCalendar('getMonthYear', function(currYear, currMonth){
		$.get('/events/getMonthEvents',{month: currMonth, year: currYear},function(monthEvents){
			self.calendarView.responsiveCalendar('clearAll');
			self.calendarView.responsiveCalendar('edit', monthEvents);
		});
	});
};

EventEditor.prototype.updateEventDom = function(){
	var self = this;
	self.eventsViewer.html("");
	
	$.get('/events/getDayEvents',{date: self.currentEditDate},function(dayEvents){
		self.events = dayEvents;
		if(self.events.length == 0){
			self.eventsViewer.html("Add an event...");
		}else{
			for(var i = 0; i < self.events.length; i++){
				var htmlTemplate = self.editEventTemplate(self.events[i]);
				self.eventsViewer.append(htmlTemplate);
			}
		}
		
		$('.single_event_edit').editable(function(value, settings){
			self.updateEvent(value);
			return value;
		}, {
			type: "event",
			onblur: "cancel"
		});
	});
};

EventEditor.prototype.updateEvent = function(eventData){
	var self = this;
	$.ajax({
		url: '/events/updateEvent',
		contentType: "application/json; charset=utf-8",
		data: eventData,
		type: 'PUT',
		success: function(result) {
			self.updateEventDom();
			self.updateCalendar();
		}
	});
};

EventEditor.prototype.newEvent = function(){
	var self = this;
	var newEventData = {
		date: self.currentEditDate,
		title: "Add a title...",
		title_kr: "직함을 주다",
		description: "description here...",
		description_kr: "서술",
		fromTime: {
			hour: "12",
			minute: "00",
			period: "AM"
		},
		toTime: {
			hour: "12",
			minute: "00",
			period: "PM"
		}
	};
	
	$.ajax({
		type: 'POST',
		url: '/events/createEvent',
		data: JSON.stringify(newEventData),
		contentType: "application/json; charset=utf-8",
		success: function(result){
			self.updateEventDom();
		}
	});
};

EventEditor.prototype.deleteEvent = function(eventId){
	var self = this;
	
	$.ajax({
		url: '/events/deleteEvent?id=' + eventId,
		contentType: "application/json; charset=utf-8",
		type: 'DELETE',
		success: function(result) {
			self.updateEventDom();
		}
	});
};

















