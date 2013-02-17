/*
 * app.js
 * ----------------------------------------
 * Initializes web application.
 * 
 */

$(document).ready(function() {

  $("#recorder").webcam({
    
    width: 398,
    height: 298

    onTick: function(remain) {

        if (0 == remain) {
            jQuery("#status").text("Cheese!");
        } else {
            jQuery("#status").text(remain + " seconds remaining...");
        }
    }

  });

});