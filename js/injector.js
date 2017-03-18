/**
 * Created by isak16 on 2016-09-19.
 */


//Iframe element
var iframe = document.createElement('iframe');
iframe.src = chrome.runtime.getURL('video.html');
iframe.id = "videoIFrame";
iframe.frameBorder = 0;


//Wrapp diven
var divPlayer = document.createElement("div");
divPlayer.id = "videoPlayer";

//Header wrapp
var divHeader = document.createElement("div");
divHeader.id = "videoPlayerHeader";
var exitButton = document.createElement("div");
exitButton.id = "exit-button";


//Appenda båda divar till DivPlayer
divPlayer.appendChild(divHeader);
divHeader.appendChild(exitButton);
divPlayer.appendChild(iframe);


//Appendar till body tagen
document.body.appendChild(divPlayer);



$( "#exit-button" ).click(function() {
    document.body.removeChild(divPlayer);
});
