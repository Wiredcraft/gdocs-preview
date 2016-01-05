// Avoid recursive frame insertion...
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id
if (!location.ancestorOrigins.contains(extensionOrigin)) {

  // Inserts gdocs-preview(s) on page
  function insertPreviews () {
    // Supported File Types
    var fileTypes = ['.pdf', '.doc', '.xls', '.ppt', 'docs.google.com', 'drive.google.com']

    var links = document.getElementsByTagName('a')
    var fileLinks = []
    var gDocsLinks = []

    Object.keys(links).forEach(function (id) {
      var link = links[id]
      fileTypes.some(function (ext) {
        if (link.href.indexOf(ext) > -1) {
          if (ext === 'docs.google.com' || ext === 'drive.google.com') {
            gDocsLinks.push(link)
          } else {
            fileLinks.push(link)
          }
          return true
        }
      })
    })

    function iframeStyle (width) {
      return 'display:block;height:600px;width:' + width + 'px;z-index:99999;border:none;margin-top:10px;margin-bottom:10px;'
    }

    fileLinks.forEach(function (link) {
      var iframe = document.createElement('iframe')

      // Must be declared at web_accessible_resources in manifest.json
      iframe.src = chrome.runtime.getURL('frame.html') + '?url=' + link.href

      // Basic Style
      iframe.style.cssText = iframeStyle(link.parentElement.clientWidth)

      // Insert after Link to include in Google doc viewer
      link.parentNode.insertBefore(iframe, link.nextSibling)
    })

    gDocsLinks.forEach(function (link) {
      var iframe = document.createElement('iframe')

      // Must be declared at web_accessible_resources in manifest.json
      iframe.src = chrome.runtime.getURL('frame.html') + '?doc=' + link.href

      // Basic Style
      iframe.style.cssText = iframeStyle(link.parentElement.clientWidth)

      // Insert after Link to include in Google doc viewer
      link.parentNode.insertBefore(iframe, link.nextSibling)
    })
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
