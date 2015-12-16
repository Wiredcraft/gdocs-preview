function getLocationParam () {
  // Google Doc
  if (window.location.search.indexOf('?doc=') > -1) {
    return { type: 'doc', url: window.location.search.replace('?doc=', '') }
  }

  // Other file
  if (window.location.search.indexOf('?url=') > -1) {
    return { type: 'file', url: window.location.search.replace('?url=', '') }
  }
};

function generateIframe(link) {
  var iframe = document.createElement('iframe')

  // Google Doc
  if (link.type === 'doc') {
    iframe.src = link.url
  }

  // Other file
  if (link.type === 'file') {
    iframe.src = 'https://docs.google.com/gview?embedded=true&url=' + link.url
  }

  return iframe
};

var iframe = generateIframe(getLocationParam())

document.getElementById('viewer').appendChild(iframe)
