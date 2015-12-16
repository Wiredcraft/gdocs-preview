// Avoid recursive frame insertion...
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
  // Supported File Types
  var fileTypes = ['.pdf', '.doc', '.xls', '.ppt', 'docs.google.com'];

  var links = document.getElementsByTagName('a');
  var fileLinks = [];
  var gDocsLinks = [];

  Object.keys(links).forEach(function (id) {
    var link = links[id];
    fileTypes.some(function (ext) {
      if (link.href.indexOf(ext) > -1) {
        if (ext === 'docs.google.com') {
          gDocsLinks.push(link)
        } else {
          fileLinks.push(link);
        }
        return true;
      }
    });
  });

  fileLinks.forEach(function (link) {
    var iframe = document.createElement('iframe');

    // Must be declared at web_accessible_resources in manifest.json
    iframe.src = chrome.runtime.getURL('frame.html') + '?url=' + link.href;

    // Basic Style
    iframe.style.cssText = 'display:block;height:600px;width:664px;z-index:99999;border:none;margin-top:10px;margin-bottom:10px;';

    // Insert after Link to include in Google doc viewer
    link.parentNode.insertBefore(iframe, link.nextSibling);
  });

  gDocsLinks.forEach(function (link) {
    var iframe = document.createElement('iframe');

    // Must be declared at web_accessible_resources in manifest.json
    iframe.src = chrome.runtime.getURL('frame.html') + '?doc=' + link.href;

    // Basic Style
    iframe.style.cssText = 'display:block;height:600px;width:664px;z-index:99999;border:none;margin-top:10px;margin-bottom:10px;';

    // Insert after Link to include in Google doc viewer
    link.parentNode.insertBefore(iframe, link.nextSibling);
  });
}
