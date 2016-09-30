// Called when the user clicks on the browser action.



//This code gets executed when the user clicks the button on the address bar
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  var bkg = chrome.extension.getBackgroundPage();
  bkg.console.log('Called on ' + tab.url );
  //initialize the nativeMessage API to connect to the backend
  var port = null;

function sendNativeMessage(url, type) {
  message = {"url": url, "type": type};
  port.postMessage(message);
  bkg.console.log("Sent message: " + JSON.stringify(message) );
}

function onNativeMessage(message) {
	//do something optionally when receiving a message from the backend
  bkg.console.log("Received message: " + JSON.stringify(message) );
}

function onDisconnected() {
  bkg.console.log("Failed to connect: " + chrome.runtime.lastError.message);
  port = null;
}

function connect() {
  var hostName = "odroid.c2.video.helper";
  bkg.console.log("Connecting to native messaging host " + hostName)
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
}

  //connect to the backend
  connect();
  //send the message
  sendNativeMessage(tab.url, "page");
  //disconnect
  onDisconnected();
  
  //inject code in page
  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="red"'
  });
});
