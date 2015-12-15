function getLocationParam () {
  return window.location.search.replace('?url=', '')
};

function generateIframe(url) {
  var iframe = document.createElement('iframe')
  iframe.src = 'https://docs.google.com/gview?embedded=true&url=' + url
  return iframe
};

var iframe = generateIframe(getLocationParam())

document.getElementById('viewer').appendChild(iframe)
