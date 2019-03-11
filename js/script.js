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
	}, "play");
}

function stop()
{
	doPost({
		'do': 'stop'
	}, "stop");
}

function plus()
{
	doPost({
		'do': 'plus'
	}, "plus");
}

function minus()
{
	doPost({
		'do': 'minus'
	}, "minus");
}

function volume(volume)
{
	doPost({
		'do': 'volume',
		'volume': volume
	}, "volume");
}

function shutdown()
{
	doPost({
		'do': 'shutdown'
	}, "shutdown");
}

function doPost(paramMap, caller)
{
	addWait(caller);
	return fetch("api.php", {
		method: "POST",
		dataType: "json",
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		body: JSON.stringify(paramMap)
	}).then(
		res => res.json()
	).then(data => {
		printStatus(data);
		removeWait(caller);
	}).catch(error => {
		document.getElementById("status").innerText = "error loading status: " + error;
		removeWait(caller);
	});
}

function loadStatus()
{
	fetch("api.php?do=status", {
		method: "GET",
		dataType: "json",
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		}
	}).then(
		res => res.json()
	).then(
		data => printStatus(data)
	).catch(
		error => document.getElementById("status").innerText = "error loading status: " + error
	);
}

function printStatus(data) {
	if(data.volume !== undefined)
		document.getElementById("volume").value = data.volume;
	if(data.playing !== undefined && !data.playing.startsWith("volume:"))
		document.getElementById("status").innerText = "playing: " + data.playing;
	else
		document.getElementById("status").innerText = "stopped";
}

function addWait(waitItem) {
	let waiter = document.getElementById("waiter");
	waiter.classList.add(waitItem);
	waiter.style.display = "";
}

function removeWait(waitItem) {
	let waiter = document.getElementById("waiter");
	waiter.classList.remove(waitItem);
	if(waiter.classList.length == 0) {
		waiter.style.display = "none";
	}
}

function addSenderRow(senderList, senderName, senderUrl) {
	let senderTemplate = document.querySelector("#senderRow").content.cloneNode(true);
	senderTemplate.querySelector(".senderName").innerText = senderName;
	senderTemplate.querySelector(".senderUrl").innerText = senderUrl;
	let id = senderName + "-" + senderUrl + "-" + Math.random();
	let index = senderList.childElementCount + 1;
	senderTemplate.querySelectorAll("a")[0].href = "javascript:play('" + index + "');";
	senderTemplate.querySelectorAll("a")[1].href = "javascript:removeSender('" + id + "');";
	senderTemplate.querySelectorAll("a")[2].href = "javascript:moveSender('" + id + "');";
	let tr = senderTemplate.querySelector("tr");
	tr.setAttribute("id", id);
	senderList.append(senderTemplate);
	return tr;
}

function changeVolume(is) {
	let volumeBar = document.getElementById("volume");
	this.volume(volumeBar.value);

	// may be called by onchange() and oninput()
	var other = is=="change" 
		? "input" 
		: "change";
	volumeBar.removeAttribute("on" + other);
	// prevent double request when double click
	setTimeout(function() {
		volumeBar.setAttribute("on" + other, "changeVolume('on" + other + "')");
	}, 1000);
}

function toggleButton(thisButton, isActive) {
	if(isActive)
		thisButton.classList.remove("active");
	else
		thisButton.classList.add("active");
	let buttons = document.getElementsByTagName("nav")[0].getElementsByTagName("a");
	for(let i = 0; i < buttons.length; i++) {
		if(!isActive && buttons[i] !== thisButton) {
			buttons[i].removeAttribute("href");
			buttons[i].style.color = "#4af";
		} else {
			buttons[i].setAttribute("href", "javascript:" + buttons[i].getAttribute("id") + "();");
			buttons[i].style.color = "";
		}
	}
	let volumeBar = document.getElementById("volumebar");
	let volumeButtons = volumeBar.querySelectorAll("a");
	let newColor = isActive ? "" : "#4af";
	for(let i = 0; i < volumeButtons.length; i++) {
		volumeButtons[i].style.color = newColor;
	}
	let volumeInput = volumeBar.querySelector("input");
	volumeInput.style.background = newColor;
	if(isActive)
		volumeInput.removeAttribute("disabled");
	else
		volumeInput.setAttribute("disabled", "true");
}

function toggleSettings() {
	let thisButton = document.getElementById("toggleSettings");
	let isActive = thisButton.classList.contains("active");
	this.toggleButton(thisButton, isActive);
	
	let playlist = document.getElementById("playlist");
	let settingslist = document.getElementById("settingslist");
	if(isActive) {
		playlist.style.display = "";
		settingslist.style.display = "none";
	} else {
		playlist.style.display = "none";
		settingslist.style.display = "";
	}
}

function toggleToEdit() {

	// deactivate all nav buttons
	let thisButton = document.getElementById("toggleToEdit");
	this.toggleButton(thisButton, false);
	thisButton.removeAttribute("href");
	thisButton.style.color = "#4af";

	// show save/reset buttons
	document.querySelector("#playlist thead").style.display = "";
	
	// switch text to input
	let rows = document.querySelectorAll("#playlist tbody tr");
	for(let i = 0; i < rows.length; i++) {
		this.switchRowToEdit(rows[i]);
	}
	
	// show add button
	document.querySelector("#playlist tfoot").style.display = "";

	// hide url column when too small
	document.getElementById("playlist").classList.remove("viewmode");
}

function toggleFromEdit() {

	// show all nav buttons
	let thisButton = document.getElementById("toggleToEdit");
	this.toggleButton(thisButton, true);
	thisButton.setAttribute("href", "javascript:" + thisButton.getAttribute("id") + "();");
	thisButton.style.color = "";

	// hide save/reset buttons
	document.querySelector("#playlist thead").style.display = "none";

	// switch input to text
	let rows = document.querySelectorAll("#playlist tbody tr");
	for(let i = 0; i < rows.length; i++) {
		this.switchRowToView(rows[i]);
	}

	// hide add button
	document.querySelector("#playlist tfoot").style.display = "none";

	// hide url column when too small
	document.getElementById("playlist").classList.add("viewmode");
}

function switchRowToEdit(tr) {
	let tds = tr.getElementsByTagName("td");
	let input = document.createElement("input");
	input.setAttribute("type", "text");
	input.setAttribute("name", "senderName");
	input.setAttribute("value", tds[1].textContent);
	tds[1].textContent = "";
	tds[1].appendChild(input);

	input = document.createElement("input");
	input.setAttribute("type", "text");
	input.setAttribute("name", "senderUrl");
	input.setAttribute("value", tds[2].textContent);
	tds[2].textContent = "";
	tds[2].appendChild(input);

	tds[0].style.display = "none";
	tds[3].style.display = "";
	
	tr.setAttribute("draggable", true);
	//td[3].getElementsByTagName("a")[1].addEventListener("dragstart", handleDragStart, false);
	// TODO
}

function switchRowToView(tr) {
	let tds = tr.getElementsByTagName("td");
	tds[1].textContent = tds[1].getElementsByTagName("input")[0].value;
	tds[2].textContent = tds[2].getElementsByTagName("input")[0].value;
	tds[0].style.display = "";
	tds[3].style.display = "none";
	
	tr.removeAttribute("draggable");
}

function handleDragStart(event) {
	this.style.opacity = "0.4";
}

function addSender() {
	let tbody = document.querySelector("#playlist tbody");
	let tr = addSenderRow(tbody, "", "");
	this.switchRowToEdit(tr);
}

function removeSender(trId) {
	document.querySelector("#playlist tbody").removeChild(document.getElementById(trId));
}

function resetSenders() {
	this.loadSenders();
	this.toggleFromEdit();
}

function loadSenders()
{
	let senderList = document.querySelector("#playlist tbody");
	while(senderList.firstChild) {
		senderList.removeChild(senderList.firstChild);
	}
	addWait("loadSenders");
	fetch("api.php?do=load", {
		method: "GET",
		dataType: "json"
	}).then(
		res => res.json()
	).then(list => {
		for(let i = 0; i < list.length; i++) {
			addSenderRow(senderList, list[i].name, list[i].url);
		}
		removeWait("loadSenders");
	}).catch(error => {
		console.error("error loading senders: " + error)
		removeWait("loadSenders");
	});
}

function saveSenders() {
	// collect list
	let trs = document.querySelectorAll("#playlist tbody tr");
	let senders = [];
	for(let i = 0; i < trs.length; i++) {
		let inputs = trs[i].getElementsByTagName("input");
		let senderName = inputs[0].value;
		let senderUrl = inputs[1].value;
		if(senderName != "" && senderUrl != "") {
			let sender = {"name": senderName, "url": senderUrl};
			senders.push(sender);
		}
	}
	// send list
	addWait("saveSenders");
	fetch("api.php", {
		method: "POST",
		dataType: "json",
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		body: JSON.stringify({
			"do": "save",
			"senders": senders
		})
	}).then(
		res => res.json()
	).then(list => {
		let senderList = document.querySelector("#playlist tbody");
		while(senderList.firstChild) {
			senderList.removeChild(senderList.firstChild);
		}
		for(let i = 0; i < list.length; i++) {
			addSenderRow(senderList, list[i].name, list[i].url);
		}
		removeWait("saveSenders");
	}).catch(error => {
		console.error("error saving status: " + error)
		removeWait("saveSenders");
	});
	this.toggleFromEdit();
}