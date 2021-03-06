function play()
{
	play(1);
}

function play(index)
{
	index = typeof index !== 'undefined' ? index : 1;
	doPost({
		'do': 'play',
		'index': index
	});
}

function stop()
{
	doPost({
		'do': 'stop'
	});
}

function plus()
{
	doPost({
		'do': 'plus'
	});
}

function minus()
{
	doPost({
		'do': 'minus'
	});
}

function volume(volume)
{
	doPost({
		'do': 'volume',
		'volume': volume
	});
}

function toggle()
{
	$(".addhide").toggle();
}

function removeEntry(index)
{
	doPost({
		'do': 'file',
		'index': index
	});
}

function addEntry()
{
	doPost({
		'do': 'file',
		'addName': $('#addName').val(),
		'addUrl': $('#addUrl').val()
	});
}

function shutdown()
{
	doPost({
		'do': 'shutdown'
	});
}

function doPost(paramMap)
{
	var form = $('<form/>').attr('action','').hide();
	$.each(paramMap, function(key, val) {
		form.append(
			$('<input/>').attr('name', key).attr('value', val)
		);
	});
	form.attr('method', 'post')
		.appendTo('body')
		.submit();
}

function loadStatus()
{
	$.ajax({
		url: "loadStatus.php",
		dataType: "json",
		success: function(data, textstatus, jqxhr) {
			if(data.volume !== undefined)
				$("#volume").val(data.volume);
			if(data.playing !== undefined)
				$("#status").html("playing: " + data.playing);
		},
		error: function(x) {
			alert("error loading status");
		}
	});
}

function changeVolume(is) {
	var volumeBar = $("#volume");
	volume(volumeBar.val());

	// may be called by onchange() and oninput(), shall be executed not more than once
	var other = is=="change" 
		? "input" 
		: "change";
	volumeBar.removeAttr("on" + other);
	setTimeout(function() {
		volumeBar.attr("on" + other, "changeVolume('on" + other + "')");
	}, 1000);
}
