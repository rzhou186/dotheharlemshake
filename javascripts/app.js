/*
 * app.js
 * ----------------------------------------
 * Initializes web application.
 * 
 */

var currStep = 1;

$(document).ready(function(){

	// Initiate ScriptCam application
  $("#webcam").scriptcam({
    width: 396,
    height: 296,
    cornerRadius: 0,
    useMicrophone: false,
    onError: alertError,
    fileName: 'uservideo',
    connected: enableRecord

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
		preCountdown(15);

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
      var snd = new Audio('audio/harlemshake-part' + currStep + '.mp3');
  	  snd.play();
    }
    else alert("HTML5 Audio is not supported by your browser!");
  }
  else alert("Error! Invalid audio filename.");
}

/*
 * Function: preCountdown()
 * Gives the client 3 seconds to prepare for new video recording.
 * 
 */
function preCountdown(seconds){
	
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
	// $.scriptcam.startRecording();
	
	// Initiate countdown
	$("#record-btn-txt").html("Recording... " + counter + " seconds left");
	var recordInterval = setInterval(function(){

		// If counter has hit 1, terminate setInterval
		if (counter === 1) {
			clearInterval(recordInterval);

			$("#record-btn").attr("disabled", false);
			$("#record-btn-txt").html("<i class='icon-eye-open icon-white'></i>&nbsp;Record");

			// Stop recording
			// $.scriptcam.closeCamera();

			// Update current step
			currStep++;
			updateStep(currStep);

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

		if (step === 3){
			$("#step2").attr("class", "progress-step center");
			$("#step3").attr("class", "progress-step right current");
			$(".helper-text").html("<span style='color: #ffffff;'>Step 3: </span>Video finished! <span style='color: #ff0000;'>Download</span> it below, then upload it or share it!");

			$("#recorder").remove();
			$("#record-btn").remove();
			$("#downloader").css("display", "block");
		}

	}
	else alert("Error! Invalid step number.");
}