/*
 * app.js
 * ----------------------------------------
 * Initializes web application.
 * 
 */

// Initialize global variables
var currStep = 1;
var filenameOne = "";
var filenameTwo = "";

// Load audio files
var harlemshake_part1 = new Audio('audio/harlemshake-part1.mp3');
var harlemshake_part2 = new Audio('audio/harlemshake-part2.mp3');

$(document).ready(function(){
	
	// Load specific video if specified in URL
	if (window.location.hash !== ""){

		// Rebuild the original filename
		var originalName = window.location.hash.replace('#','') + ".mpg";
		originalName = [originalName.slice(0, 7), "_uservideo", originalName.slice(7)].join('');
		originalName = [originalName.slice(0, 24), "_uservideo", originalName.slice(24)].join('');

		// initiateJWPlayer(originalName);
		displayDownloader();
		$(".progress-tracker").css("visibility", "hidden");
		$(".helper-text").html("<span style='color: #ffffff;'>Step 3: </span>Video finished! <span style='color: #ff0000;'>Download</span> it below, then upload it or share it!");

		$("#download-btn").click(function() {
  		document.location.href = '/download.php?f=' + originalName;
  	});
		$("#download-btn-txt").html("<i class='icon-hand-right icon-white'></i>&nbsp;&nbsp;Download Video&nbsp;&nbsp;<i class='icon-hand-left icon-white'></i>");
		$("#download-btn").attr("disabled", false);

		return;
	}

	// Initiate ScriptCam application
  $("#webcam").scriptcam({
    width: 396,
    height: 296,
    cornerRadius: 0,
    useMicrophone: false,
    onError: alertError,
    fileName: 'uservideo',
    connected: enableRecord,
    fileReady: fileReady

		/*
		ScriptCam encodes the below path incorrectly, causing the web app to fail,
	 		so I directly modified the path name in scriptcam.js.
	 		In particular, it replaces '/' with '%2F'.
	 		See scriptcam.js for the path name fix.
	  path: 'javascripts/scriptcam/'
	  */

  });

});

/* -------------------- ScriptCam Functions -------------------- */

/*
 * Function: alertError()
 * Called whenever ScriptCam runs into an error.
 * 
 */
function alertError(errorId, errorMsg) {
	if (errorId === 4){
		$("#webcam").remove();
		$("#record-btn-txt").html("Webcam access denied.");
	}
	else if (errorId !== 7){
		alert(errorMsg);
	}
}

/*
 * Function: enableRecord()
 * Triggered when ScriptCam successfully establishes a connection.
 * Activates record button.
 * 
 */
function enableRecord() {

	$("#record-btn").attr("disabled", false);
	$("#record-btn-txt").html("<i class='icon-eye-open icon-white'></i>&nbsp;Record");

	$("#record-btn").click(function(){
		
		$("#record-btn").attr("disabled", true);
		startCountdown(15);

	});

}

/*
 * Function: fileReady()
 * Triggered when a video is successfully recorded.
 * Has access to the file name of the video.
 * 
 */
function fileReady (fileName){

	if (currStep === 2){
		filenameOne = fileName;

		// Disable record button until ScriptCam is reinitialized
		$("#record-btn").attr("disabled", true);
		$("#record-btn-txt").html("Reinitializing webcam...");

		// Reinitialize ScriptCam application (because ScriptCam is shitty and this is the only solution)
		$("#webcam").scriptcam({
	    width: 396,
	    height: 296,
	    cornerRadius: 0,
	    useMicrophone: false,
	    onError: alertError,
	    fileName: 'uservideo',
	    connected: enableRecord,
	    fileReady: fileReady
	  });
	}

	if (currStep === 3){

		filenameTwo = fileName;
		displayDownloader();
		$(".helper-text").html("<span style='color: #ffffff;'>Step 3: </span>Video finished! <span style='color: #ff0000;'>Download</span> it below, then upload it or share it!");

		// Give ScriptCam time to load final recording to FTP server
		setTimeout(function(){
			buildHSVideo(filenameOne, filenameTwo, 'audio/harlemshake-complete.mp3');
		},15000);

	}

}

/* -------------------- Server-Side Video Functions -------------------- */

/*
 * Function: buildHSVideo()
 * Builds the final video, sending a JQuery AJAX request to videobuilder.php
 * Requires 2 recordings and 1 audio file.
 * 
 */
function buildHSVideo(recordingOne, recordingTwo, audioFile){

	recordingOne = recordingOne.replace('.mp4','');
	recordingTwo = recordingTwo.replace('.mp4','');

	var form_data = {
		recordingOne: recordingOne,
		recordingTwo: recordingTwo,
		audioFile: audioFile,
		is_ajax: 1
	};

	var request = $.ajax({
		url: "videobuilder.php",
		type: "POST",
		data: form_data,
		success: function(data){
			history.pushState(null, null, "/#" + data.replace('.mpg', '').replace(/_uservideo/g,''));
			// initiateJWPlayer(data);
			$("#download-btn").click(function() {
    		document.location.href = '/download.php?f=' + data;
    	});
			$("#download-btn-txt").html("<i class='icon-hand-right icon-white'></i>&nbsp;&nbsp;Download Video&nbsp;&nbsp;<i class='icon-hand-left icon-white'></i>");
			$("#download-btn").attr("disabled", false);
		}
	});

}

/* -------------------- DOM Manipulation & Countdowns  -------------------- */

/*
 * Function: startCountdown()
 * Gives the client 3 seconds to prepare for new video recording.
 * 
 */
function startCountdown(seconds){
	
	var counter = 3;
	$("#record-btn-txt").html(counter);
	var recordInterval = setInterval(function(){

		// If counter has hit 1, terminate setInterval
		if (counter === 0) {
			clearInterval(recordInterval);
			completeCountdown(seconds);
		}

		else if (counter === 1){
			counter--;
			$("#record-btn-txt").html("Go!");
		}

		// Else, decrease counter by 1 and continue countdown
		else{
			counter--;
			$("#record-btn-txt").html(counter);
		}

	}, 1000);

}

/*
 * Function: recordCountdown()
 * Disables and dynamically styles record button for given number of seconds.
 * 
 */
function completeCountdown(seconds){

	var counter = seconds;

	playHarlemShake(currStep);

	// Start recording
	$.scriptcam.startRecording();
	
	// Initiate countdown
	$("#record-btn-txt").html("Recording... " + counter + " seconds left");
	var recordInterval = setInterval(function(){

		// If counter has hit 1, terminate setInterval
		if (counter === 0) {
			clearInterval(recordInterval);

			// Stop recording
			$.scriptcam.closeCamera();

			// Update current step
			if (currStep < 3) {
				currStep++;
				updateStep(currStep);
			}	
		}

		// Else, decrease counter by 1 and continue countdown
		else{
			counter--;
			$("#record-btn-txt").html("Recording... " + counter + " seconds left");
		}

	}, 1000);

}

/*
 * Function: displayDownloader()
 * Replaces the app window's recorder element with the downloader and video player
 * 
 */
function displayDownloader(){
	$("#recorder").remove();
	$("#record-btn").remove();
	$("#vidplayer").css("display", "block");
	$("#downloader").css("display", "block");

	$("#step2").attr("class", "progress-step center");
	$("#step3").attr("class", "progress-step right current");
}

/* -------------------- JW Player Functions  -------------------- */

function initiateJWPlayer(vidname){
	alert("Initiating JW Player...");
  jwplayer('#vidplayer').setup({
		file: 'videos/' + vidname,
		width: '396',
		height: '296'
  });
 }

/* -------------------- Miscellaneous Functions  -------------------- */

/*
 * Function: playHarlemShake()
 * Plays part 1 or part 2 of Harlem Shake audio, depending on argument.
 * 
 */
function playHarlemShake(part){
	if (part === 1 || part === 2){
		if (window.HTMLAudioElement) {
			if (part === 1) harlemshake_part1.play();
  	  else if (part === 2) harlemshake_part2.play();
    }
    else alert("HTML5 Audio is not supported by your browser!");
  }
  else alert("Error! Invalid audio filename.");
}

/*
 * Function: updateStep()
 * Updates app-window elements and properties to match current step
 * 
 */
function updateStep(step){

	if (step === 2){
		$("#step1").attr("class", "progress-step left");
		$("#step2").attr("class", "progress-step center current");
		$(".helper-text").html("<span style='color: #ffffff;'>Step 2: </span>Good work! Now <span style='color: #ff0000;'>record</span> the second half. Keep the sound turned on!");			
	}
	else if (step !== 3){
		alert("Error! Invalid step number.");
	}

}