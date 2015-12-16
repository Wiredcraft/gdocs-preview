// Avoid recursive frame insertion...
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
  var links = document.getElementsByTagName('a');
  var pdfLinks = [];

  Object.keys(links).forEach(function (id) {
    var link = links[id];
    if (link.href.indexOf('.pdf') > -1 || link.href.indexOf('.doc')) {
      pdfLinks.push(link);
    }
  });

  pdfLinks.forEach(function (link) {
    var iframe = document.createElement('iframe');

    // Must be declared at web_accessible_resources in manifest.json
    iframe.src = chrome.runtime.getURL('frame.html') + '?url=' + link.href;

    // Basic Style
    iframe.style.cssText = 'display:block;height:600px;width:664px;z-index:99999;border:none;margin-top:10px;margin-bottom:10px;';

    // Insert after Link to include in Google doc viewer
    link.parentNode.insertBefore(iframe, link.nextSibling)
  });
}
