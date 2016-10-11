//Code contributed from http://stackoverflow.com/questions/39933888/pass-data-from-dom-to-native-messaging-api

// You need to modify it for screen with video you want and for support old flash videos too
var blocks=document.getElementsByTagName("video");
var playCount = new Array();
for(i=0;i<blocks.length;i++){
	console.log("odroid.c2.video.helper: Adding an event to element"+blocks[i]);
	blocks[i].addEventListener("playing", function(event){
		console.log("odroid.c2.video.helper: Called in playing event");
		if(event.srcElement.currentSrc.match(/^blob/)){
			console.log("odroid.c2.video.helper: Video type "+event.srcElement.currentSrc+" is unsupported by the extension");
		}
		else{
			console.log("odroid.c2.video.helper: Video type "+event.srcElement.currentSrc+" seems to be supported. Pausing");
			
			//has the video been played before? -- undefined = no
			if(typeof playCount[event.srcElement.currentSrc] == 'undefined'){
				//remember we've paused this video
				playCount[event.srcElement.currentSrc] = 1;
				//pause the video in the browser
				console.log("odroid.c2.video.helper: We're pausing the video playback");
				event.srcElement.pause();
				//send to background for playback
				console.log("odroid.c2.video.helper: Sending "+event.srcElement.currentSrc+" to backend for playback");
				sendUrlToBg(event.srcElement.currentSrc);
			}
			else{
				//we've tried to play it already. We won't intercept it this time
				console.log("odroid.c2.video.helper: Video has been played externally already. We'll not send it again");
			}
		}
	});
	
  //registerButton(blocks[i]);
}

// Add button and process click to it
function registerButton(block)
{
  var video=block;
  var button=document.createElement("input");
  button.type='button';
  button.class='getVideo';
  button.value='Send Video To external player';
  button.addEventListener('click',function(){sendUrlToBg(video.src);});
  //To add a visible button we need to know which parent is visible - which is a pain...
  block.parentNode.parentNode.parentNode.appendChild(button);
  //block.parentNode.parentNode.parentNode.append(button);
}

// Send URL to background script
function sendUrlToBg(url)
{
	console.log("odroid.c2.video.helper: Sending url "+ url+" to extension");
    chrome.runtime.sendMessage({"action":"openBrowser","url":url},function(r){
        // process response from background script if you need, hide button, for example
    });
}
