/*
 * app.js
 * ----------------------------------------
 * Initializes web application.
 * 
 */

var currStep = 1;
var filenameOne = "";
var filenameTwo = "";

// Load audio files
var harlemshake_part1 = new Audio('audio/harlemshake-part1.mp3');
var harlemshake_part2 = new Audio('audio/harlemshake-part2.mp3');

$(document).ready(function(){

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

/*
 * Function: fileReady()
 * Triggered when a video is successfully recorded.
 * Has access to the file name of the video.
 * 
 */
function fileReady (fileName){

	//console.log('Logging filename in general' + fileName);
	if (currStep === 2){
		//console.log('When step is 2' + fileName);
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
		//console.log('When step is 3' + fileName);
		filenameTwo = fileName;
		$("#recorder").remove();
		$("#record-btn").remove();
		$("#downloader").css("display", "block");

		$("#step2").attr("class", "progress-step center");
		$("#step3").attr("class", "progress-step right current");
		$(".helper-text").html("<span style='color: #ffffff;'>Step 3: </span>Video finished! <span style='color: #ff0000;'>Download</span> it below, then upload it or share it!");

		deleteFromServer(filenameOne);
	}

}

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
}

/*
 * Function: deleteFromServer()
 * Sends a JQuery AJAX request to the server, 
 * where deletevid.php deletes the appropriate MP4 file.
 * 
 */
function deleteFromServer(filename){

	$.ajax({
		url: "/deletevid.php",
		type: "POST",
		data: "/home/scriptcam/" + filename
	});

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
		if (counter === 1) {
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
 * Function: updateStep()
 * Updates app-window elements and properties to match current step
 * 
 */
function updateStep(step){

	if (step === 2 || step === 3){

		if (step === 2){
			$("#step1").attr("class", "progress-step left");
			$("#step2").attr("class", "progress-step center current");
			$(".helper-text").html("<span style='color: #ffffff;'>Step 2: </span>Good work! Now <span style='color: #ff0000;'>record</span> the second half. Keep the sound turned on!");			
		}

		// I moved the below lines of code to the fileReady function.
		// In fact, this whole function is probably unnecessary, and can be addressed in fileReady.
		/*
		if (step === 3){
			$("#step2").attr("class", "progress-step center");
			$("#step3").attr("class", "progress-step right current");
			$(".helper-text").html("<span style='color: #ffffff;'>Step 3: </span>Video finished! <span style='color: #ff0000;'>Download</span> it below, then upload it or share it!");
		}
		*/

	}
	
	else alert("Error! Invalid step number.");

}