//global functions
var port = null;
function sendNativeMessage(url, type) {
  message = {"url": url, "type": type};
  port.postMessage(message);
  console.log("odroid.c2.video.helper: Sent message: " + JSON.stringify(message) );
}

function onNativeMessage(message) {
	//do something optionally when receiving a message from the backend
  console.log("odroid.c2.video.helper: Received message: " + JSON.stringify(message) );
}

function onDisconnected() {
  console.log("odroid.c2.video.helper: Failed to connect: " + chrome.runtime.lastError.message);
  port = null;
}

function connect() {
  var hostName = "odroid.c2.video.helper";
  console.log("odroid.c2.video.helper: Connecting to native messaging host " + hostName)
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
}

//This code gets executed when the user clicks the button on the address bar
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('odroid.c2.video.helper: Called on ' + tab.url );
  //initialize the nativeMessage API to connect to the backend

  //connect to the backend
  connect();
  //send the message
  sendNativeMessage(tab.url, "page");
  //disconnect
  onDisconnected();
  
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if("action" in request && request.action == 'openBrowser'){
        // Send message to embeded app
        console.log('odroid.c2.video.helper: Received message for ' + request.url );
        //connect to the backend
		connect();
		//send the message
		sendNativeMessage(request.url, "link");
		//disconnect
		onDisconnected();
        // Send response for content script if you need
        sendResponse({"action":"openBrowserAnswer","status":"OK"});
    }
  }
);
