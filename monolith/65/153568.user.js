// ==UserScript== 
// Based on a script in Mark Pilgram's upcoming "Dive into Greasemonkey",
// based off another script based off that
// I love my nerdy friends SO MUCH
// used to be called replaceannoyingwords

// @name          ERICB
// @namespace     http://userscripts.org/userscripts
// @description   ericb is the linkmaster
// @include        http://metafilter.com/*
// @include        http://*.metafilter.com/*
 
// ==/UserScript== 

(function() {
    var replacements, regex, key, textnodes, node, s; 

    replacements = { 
        "ericb": "ericb, linkmaster",
        "jessamyn": "Mom"
    }; 

    regex = {}; 
    for (key in replacements) { 
        regex[key] = new RegExp(key, 'g'); 
    } 

    textnodes = document.evaluate( "//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null); 

    for (var i = 0; i < textnodes.snapshotLength; i++) { 
        node = textnodes.snapshotItem(i); 
        s = node.data; 
        for (key in replacements) { 
            s = s.replace(regex[key], replacements[key]); 
        } 
        node.data = s; 
    } 

})();

