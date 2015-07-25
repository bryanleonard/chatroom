/*
Helper functions
 */

function divEscapedContentElement(message) {
	return $("<div></div>").text(message);
};

function divSystemContentElement(message) {
	return $("<div></div>").html("<i>" + message + "</i>");
};

/*
Process raw user input
 */

function processUserInput(chatApp, socket) {
	var message = $("#send-message").val();
	var systemMessage;

	if (message.charAt(0) == "/") { // If user input begins with a slash
		systemMessage = chatApp.processCommand(message);

		if (systemMessage) {
			$("#messages").append(divSystemContentElement(systemMessage));
		}

	} else {
		chatApp.sendMessage($("#room").text(), message); // Broadcast non-command input other users. IE, chat.
		$('#messages').append(divEscapedContentElement(message));
		$('#messages').scrollTop($('#messages').prop("scrollHeight"));
	}      
	
	$('#send-message').val('');

};


/*
Nitty and the gritty
 */
var socket = io.connect();


$(function() {
	var chatApp = new Chat(socket);
	
	socket.on("nameResult", function(result) { // Display name change result
		if (result.success) {
			message = "You are now known as "  + result.name + ".";
		} else {
			message = result.message;
		}
		$('#messages').append(divSystemContentElement(message));
	});

	socket.on("joinResult", function(result) { // Display room change results
		$('#room').text(result.room);
		$('#messages').append(divSystemContentElement("Room changed."));
	});

	socket.on("message", function(message) { // Display received messages
		var newEl = $('<div></div>').text(message.text);
		$('#messages').append(newEl);
	});

	socket.on("rooms", function(rooms) { // Display list of avail rooms
		$('#room-list').empty();

		console.log('rooms', rooms);

		for (var room in rooms) {
			room = room.substring(1, room.length);
			if (room != "") {
				$('#room-list').append(divEscapedContentElement(room));
			}
		}
	});

	$('#room-list').find('div').on('click', function() {
		chatApp.processCommand("/join" + $(this).text());
	});

	setInterval(function() {
		socket.emit("rooms");
	}, 1000);

	$('#send-message').focus();

	$('#send-button').on("click", function(e) {
		e.preventDefault();
		processUserInput(chatApp, socket);
		return false;
	})

	// $('#send-form').submit(function() {
	// 	return false;
	// });

});









