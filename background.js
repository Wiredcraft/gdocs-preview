var TAB_DATA = {}

// Message passing from content scripts
chrome.runtime.onConnect.addListener(function(port) {
  if (port.name !== 'gdocspreview') { return false };
  
  var tabId = port.sender.tab.id;
  // console.log('Connected to tab:', tabId);

  port.onMessage.addListener(function(msg) {
    switch (msg.type) {
      case 'badgeCount':
        chrome.browserAction.setBadgeText({ text: msg.count.toString(), tabId: tabId });
        break;
      default:
        // console.log('BS received:',msg);
        break;
    };
  });
});

// TODO: test the idea below
// Detect url changes here and message tab to update
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // console.log('onUpdated', tabId, changeInfo, tab);

  if (changeInfo.status === 'complete') {
    chrome.tabs.sendMessage(tabId, { type: 'update' }, function(response) {
      if (!response) return false
      TAB_DATA[tabId] = { tab: tab, meta: response.meta }
    })
  }
})

chrome.tabs.onCreated.addListener(function(tab) {
  TAB_DATA[tab.id] = { tab: tab, meta: {} }
})

chrome.tabs.onRemoved.addListener(function(tabId) {})
