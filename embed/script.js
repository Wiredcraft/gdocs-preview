function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
};

function generateIframe(link) {
  var iframe = document.createElement('iframe')

  // Google Doc
  if (link.type === 'gdoc') {
    iframe.src = link.href
  }

  // Other file
  if (link.type === 'file') {
    iframe.src = 'https://docs.google.com/gview?embedded=true&url=' + link.href
  }

  return iframe
};

var iframe = generateIframe(getJsonFromUrl())

document.getElementById('viewer').appendChild(iframe)
