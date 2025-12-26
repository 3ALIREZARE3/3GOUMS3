chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'START' || msg.type === 'STOP' || msg.type === 'UPDATE_SETTINGS') {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, msg);
      }
    });
  }
  sendResponse({ok:true});
});
