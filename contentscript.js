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
      iframe.src = chrome.runtime.getURL('frame.html') + '?type=' + item.type + '&href=' + item.link.href

      // Basic Style
      iframe.style.cssText = iframeStyle(item.link.parentElement.clientWidth)

      // Insert after Link to include in Google doc viewer
      item.link.parentNode.insertBefore(iframe, item.link.nextSibling)

      return { iframe: iframe }
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
      console.info(
        'gdocs-preview detected a page change without a full reload. \n' +
        'If you see any errors please create a bug report @ https://github.com/wiredcraft/gdocs-preview/issues \n' +
        'Include the following URL in your report: ' + location.href
      )
      oldLocation = location.href
      insertPreviews()
    }
  }, 1000) // check every second

  // If pages changes clear interval
  window.addEventListener('onbeforeunload', function () {
    clearInterval(interval)
  })
}
