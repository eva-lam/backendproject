$(function(){
	$('#refreshBtn').on('click', function(){
		console.log('refreshing room-boxes')
		$('.allRooms').html('')
		socket.emit('findingAllRooms')
	})

	$('#refreshBtn').click()

	socket.on('buildingRoomBox', function(roomID, currSongID){
		if (roomID && currSongID) {console.log('properly recevied ' + currSongID + ' and ' + currSongID)} else { console.log('failed to receive roomID and currSongID'); return}
		console.log('building room box for ' + roomID)
		$.get("partial-html/room-box.html", function(template){
			$('.allRooms').append(tplawesome(
				template, [{
					"roomID": roomID,
					"videoID": currSongID
				}]
			))
		})
	})
})

function tplawesome(e, t) {res = e; for (var n = 0; n < t.length; n++) {res = res.replace(/\{\{(.*?)\}\}/g, function (e, r) {return t[n][r]})}return res}