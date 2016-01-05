// Avoid recursive frame insertion...
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id
if (!location.ancestorOrigins.contains(extensionOrigin)) {

  var port = chrome.runtime.connect({name: "gdocspreview"});
  // port.onMessage.addListener(function(msg) {
  //   console.log('CS received:', msg)
  // });


  var activeEmbeds = [];

  // Inserts gdocs-preview(s) on page
  function insertPreviews () {
    // Supported File Types
    var fileTypes = ['.pdf', '.doc', '.xls', '.ppt', 'docs.google.com']

    var links = document.getElementsByTagName('a')
    var fileLinks = []

    Object.keys(links).forEach(function (id) {
      var link = links[id]
      fileTypes.some(function (ext) {
        if (link.href.indexOf(ext) > -1) {
          fileLinks.push({
            type: ext === 'docs.google.com' ? 'gdoc' : 'file',
            link: link
          })
          return true
        }
      })
    })

    function iframeStyle (width) {
      return 'display:block;height:600px;width:' + width + 'px;z-index:99999;border:none;margin-top:10px;margin-bottom:10px;'
    }

    activeEmbeds = fileLinks.map(function (item) {
      var iframe = document.createElement('iframe')

      // Must be declared at web_accessible_resources in manifest.json
      iframe.src = chrome.runtime.getURL('embed/frame.html') + '?type=' + item.type + '&href=' + encodeURIComponent(item.link.href)

      // Basic Style
      iframe.style.cssText = iframeStyle(item.link.parentElement.clientWidth)

      // Insert after Link to include in Google doc viewer
      item.link.parentNode.insertBefore(iframe, item.link.nextSibling)

      // Mapped to item in active embeds
      return { type: item.type, link: item.link, iframe: iframe }
    })

    // Set badgeText to embed count
    if (activeEmbeds.length > 0) {
      port.postMessage({ type: 'badgeCount', count: activeEmbeds.length});
    }
  }

  // Insert previews on page load
  insertPreviews()

  // Watch for ajax page changes and re-insert previews
  var oldLocation = location.href
  var interval = setInterval(function() {
    if (location.href != oldLocation) {
      oldLocation = location.href
      insertPreviews()
    }
  }, 1000) // check every second

  // If pages changes clear interval
  window.addEventListener('onbeforeunload', function () {
    clearInterval(interval)
  })

  /*
    Works great for triggering insertPreviews() BUT need to track whether embed is already inserted as to not insert duplicates
  */
  // Meta request listener
  // chrome.runtime.onMessage.addListener(
  //   function(request, sender, sendResponse) {
  //     if (request.type === 'update') {
  //       insertPreviews()
  //       sendResponse({ meta: { href: window.location.href } });
  //     }
  //   }
  // )
}
