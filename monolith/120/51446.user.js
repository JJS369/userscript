// 
// version 1 (beta)
// 2009-06-14
// auteur : Bagfender http://amazonsalliance.forum-actif.net
// version modifiee en francais de http://www.ikaraimlibrary.com/
// 
// Added support for ikariam version 0.3.1
// Added showed info about ally score position
// Added showed info about militar score position ( not only how much )
// Added showed info for gold score position ( not only how much )
// Font size are now 12
// Removed line for how many ally members, it can be shown near ally score.
// needed code cleanup.
// a
// ==UserScript==
// @name           Ikariam Score +
// @namespace      ikariam
// @description    donne des informations sur les scores des joueurs
// @version        v0.3.1
// @include        http://*.ikariam.*/*?view=island*
// @exclude        http://board.ikariam.*/*
//                 2009/6/14
// ==/UserScript==

var baseDivCreated = false;
var gameServer = top.location.host;
var gameServerParts = gameServer.split(".");
var subDomain = gameServerParts[1];
var domain = gameServerParts[2];

var post = {
    score: "score",
 military: "army_score_main",
     gold: "trader_score_secondary" };
     
var updateCounter =0;
var scoreTypes = {
    0: "score", 
    1: "military", 
    2: "gold",
    3: "allyscore",
    //4: "allymembers",
};

var scoreShown = false;

getElementsByClass = function(inElement, className, findIn) {
  var all = inElement.getElementsByTagName('*');
  var elements = [];
  for (var e = 0; e < all.length; e++) {
    if (findIn == true) {
        if (all[e].className.indexOf(className) > 0) {
            elements[elements.length] = all[e];
        }
    } else {
        if (all[e].className == className) {
            elements[elements.length] = all[e];
        }
    }
  }
  return elements;
};

String.prototype.TrimHTML = function() { return this.replace(/(<[^>]*>)/g, ""); }

// called using player name, score type, 
function requestScore(playerName, type, onload) {
    GM_xmlhttpRequest({
        method:'POST',
        url:'http://' + gameServer + '/index.php',
        data:"view=highscore&highscoreType=" + post[type] + "&searchUser=" + playerName,
        headers: {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/atom+xml,application/xml,text/xml',
            'Referer': 'http://' + gameServer + '/index.php', 
            'Cookie': document.cookie
        },
        onload:onload
    });
}

function requestAlliance(allyId, onload) {
    GM_xmlhttpRequest({
        method:'POST',
        url:'http://' + gameServer + '/index.php',
        data:"view=allyPage&allyId=" + allyId, 
        headers: {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/atom+xml,application/xml,text/xml',
            'Referer': 'http://' + gameServer + '/index.php',
            'Cookie': document.cookie
        },
        onload:onload
    });
}


function fmtNumber(n) {
  n += "";
  for (var i = (n.length - 3); i > 0; i -= 3) {
    n = n.slice(0, i) +","+ n.slice(i);
  }
  return n;
}
/*
        <li style="margin: 2px 10px;font-size:10px" id="ally_members" class="ally">
            <span style="float:left;" class="textLabel">{lang['allymembers']}:</span>
            <div id="allymembers">{lang['unknown']}</div>
        </li>
	*/
function createBaseDiv() {
    baseDivCreated = true;
    
    scoreElement = document.createElement("div");
    scoreElement.setAttribute("id", "inlinescore");
    scoreElement.setAttribute("class", "dynamic");
    var scoreDiv = <>
    	<h3 style="margin-left:-5px;margin-right:-2px;" class="header">{lang['inline']}</h3>
        <li style="margin: 2px 10px;font-size:12px" id="ally_score" class="ally">
            <span style="float:left;" class="textLabel">{lang['allyscore']}:</span>
            <div id="allyscore">{lang['unknown']}</div>
        </li>
        <li style="margin: 2px 10px;font-size:12px" id="total_score" class="ally">
            <span style="float:left;" class="textLabel">{lang['score']}:</span>
            <div id="score">{lang['unknown']}</div>
        </li>
        <li style="margin: 2px 10px;font-size:12px" id="army_score_main" class="ally">
            <span style="float:left;" class="textLabel">{lang['military']}:</span>
            <div id="military">{lang['unknown']}</div>
        </li>
        <li style="margin: 2px 10px;font-size:12px" id="trader_score_secondary" class="ally">
            <span style="float:left;" class="textLabel">{lang['gold']}:</span>
            <div id="gold">{lang['unknown']}</div>
        </li>
    </>;
    
    scoreElement.innerHTML = scoreDiv;
    
    // get container for Island view
    var informationContainer = document.getElementById('infocontainer');
    if (!informationContainer) { 
        informationContainer = document.getElementById('information'); 
    }
    
    //var allyClass = getElementsByClass(informationContainer, "ally") 
    
    //insertAfter(scoreElement, allyClass[0]);
    insertAfter(scoreElement, informationContainer);
    scoreShown = true;
}

function insertAfter(newElement,targetElement) {
    //target is what you want it to go after. Look for this elements parent.
    var parent = targetElement.parentNode;

    //if the parents lastchild is the targetElement...
    if(parent.lastchild == targetElement) {
        //add the newElement after the target element.
        parent.appendChild(newElement);
    } else {
        // else the target has siblings, insert the new element between the target and it's next sibling.
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}

function updateScore(type, score) {
    document.getElementById(type).innerHTML = " "+score;
}

function updateDetails(type, playerName, townLevel, responseText) {
    var hiddenDiv = document.createElement("div");
    hiddenDiv.setAttribute("style", "display: hidden;");
    document.body.appendChild(hiddenDiv);
    hiddenDiv.innerHTML = responseText;
    var score = getElementsByClass(hiddenDiv, "score", false);
	var place = getElementsByClass(hiddenDiv, "place", false);
    var pname = getElementsByClass(hiddenDiv, "name", false);
    for (var e = 0; e < pname.length; e++) {
        if (pname[e].innerHTML == playerName) {
            var totalScore = score[e].innerHTML;
			var totalRank = place[e].innerHTML;
        }
    }
    document.body.removeChild(hiddenDiv);


    GM_setValue(type, totalScore);
    document.getElementById(type).innerHTML = totalScore+"   #"+totalRank;
}

function updateAllyDetails(divId, responseText) {
    var hiddenDiv = document.createElement("div");
    hiddenDiv.setAttribute("style", "display: none;");
    document.body.appendChild(hiddenDiv);
    hiddenDiv.innerHTML = responseText;

    var allyTable = getElementsByClass(hiddenDiv, 'content', false);

    var members = parseInt(allyTable[1].childNodes[1].childNodes[1].childNodes[4].childNodes[2].innerHTML, 10);
	//alert("memb"+members);
	//alert("posscore"+allyTable[1].childNodes[1].childNodes[1].childNodes[8].childNodes[1].childNodes[1].innerHTML);
    var posScore = allyTable[1].childNodes[1].childNodes[1].childNodes[8].childNodes[2].innerHTML;

    if (/([0-9]+)\s\((.+)\)/.exec(posScore)!=null) {
    	//allRank = RegExp.$1;
    	//posScore = RegExp.$2;
    }
    document.body.removeChild(hiddenDiv);
    
    var strScore = posScore //+ " (" + allRank + ")";
    document.getElementById("allyscore").innerHTML = strScore+ " (" + members + ")";
    GM_setValue("allyscore", strScore);
//    document.getElementById("allymembers").innerHTML = members;
//    GM_setValue("allymembers", members);
//    GM_setValue(divId, (posScore + " (" + members + ")"));
//    document.getElementById(divId).innerHTML =  (posScore + " (" + members + ")");
}

function cityInformation() {
    if (!document.getElementById("inlinescore")) {
        createBaseDiv();
    }
    else {
    	document.getElementById('ally_score').style.display = "block";
    	//document.getElementById('ally_members').style.display = "block";
    }
    // Get the lanugage
    lang = defineLanguage(domain);
    
    var playerScore = -1;
    // Remove the "points" information (as of 0.2.8), and get the value for later
    var infoContainer = document.getElementById("infocontainer");
    if (infoContainer) {
        var pointsLi = getElementsByClass(infoContainer, "name", false);
        if (pointsLi[1]) {
            playerScore = parseInt(pointsLi[1].innerHTML.split(/>/)[2].replace(/,/g, ""),10);
            pointsLi[1].style.display = "none";
        }
    }
    
    // Remove the disabled actions... looks messy when it happens
    //var actions = document.getElementById("actions");
    //if (actions) {
    //    textSpans = getElementsByClass(actions, "disabled", true);
    //    for (var cnt = 0; cnt < textSpans.length;cnt++) {
    //        //textSpans[cnt].style.display = "none";
    //    }
    //}
    
    
    // Removes the report player link, again causes a fliker
    //var reportPlayer = getElementsByClass(document, "reportPlayer");
    //reportPlayer[0].style.display = "none";
    
    updateScore("score", lang.fetch);
    updateScore("military", lang.fetch);
    updateScore("gold", lang.fetch);
    updateScore("allyscore", lang.fetch); 
    //updateScore("allymembers", lang.fetch);
	
    var listParts = "";
    // Get the players name
    listParts = getElementsByClass(document,"owner", false)[0].innerHTML.split(">");
    listParts[2] = listParts[2].split("<")[0];
    var playerName = listParts[2].replace(/^\s+|\s+$/g, ''); // trim up the Player Name// get the players name
    playerName = playerName.replace(/&nbsp;/g, " "); // replace any silly nubspaces!
    
    // Get the players town level for gold pillage data
    listParts = getElementsByClass(document,"citylevel", false)[0].innerHTML.split(">");
    listParts[2] = listParts[2].split("<")[0];
    var townLevel = parseInt(listParts[2].replace(/^\s+|\s+$/g, ''), 10); // trim up the town level
    
    // Get the players alliance id for alliance check
    listParts = getElementsByClass(document,"ally", false)[0].innerHTML;
    if (/allyId=([0-9]+)/.exec(listParts) != null) {
    	var allyId = RegExp.$1;
    } else {
        var allyId = -1;
        GM_setValue("allyscore", "-");
        //GM_setValue("allymembers", "-");
    }
    
    var checkedTime = (new Date().getTime() - (1000*60*10));
    if (playerName != GM_getValue("lastPlayerCheck") || GM_getValue("lastCheckedTimestamp") < checkedTime || GM_getValue("lastServerCheck") != gameServer) {

        if (playerScore > -1) {
            updateScore('score', fmtNumber(playerScore));
        } else {
            requestScore(playerName, 'score', function(responseDetails) {
                updateDetails('score', playerName, townLevel, responseDetails.responseText);
            });
        }
        
        requestScore(playerName, 'military', function(responseDetails) {
            updateDetails('military', playerName, townLevel, responseDetails.responseText);
        });
        requestScore(playerName, 'gold', function(responseDetails) {
            updateDetails('gold', playerName, townLevel, responseDetails.responseText);
        });
        
        if (allyId != -1) {
            requestAlliance(allyId, function(responseDetails) {
                updateAllyDetails('allyscore', responseDetails.responseText);
            });
        } else {
            updateScore("allyscore", "-")
            //updateScore("allymembers", "-")
            document.getElementById('ally_score').style.display = "none";
            //document.getElementById('ally_members').style.display = "none";
        }
        
        
        GM_setValue("lastCheckedTimestamp", new Date().getTime() + "");
        GM_setValue("lastPlayerCheck", playerName);
        GM_setValue("lastServerCheck", gameServer);
    } else {
        for(key in scoreTypes) {
            var type = scoreTypes[key];
            if (type == "allyscore" && GM_getValue(type) == "-") {
                document.getElementById('ally_score').style.display = "none";
            }
            /*if (type == "allymembers" && GM_getValue(type) == "-") {
            	document.getElementById('ally_members').style.display = "none";
            }*/
            document.getElementById(type).innerHTML = GM_getValue(type);
        }
    }
}

function defineLanguage(langTDL) {
    switch (langTDL) {
        case "fr":
            language = { inline:"Score du joueur",
            fetch:"recherche... ",
            unknown:"Inconnu ",
            allyscore:"Alliance ",
            allymembers:"Nb Membre ",
            score:"Points ",
            military:"Troupes ",
            gold:"Tresor ",
            loot:"loot" };
            break;
    }
    return language;
}



function init() {
    lang = defineLanguage(domain);
    
    var linkElements = document.getElementsByTagName('a');
    for (var i = 0; i < linkElements.length; i++) {
        if (linkElements[i].id.search(/city_[0-9]*/) != -1) {
            linkElements[i].addEventListener('click', function() { window.setTimeout(cityInformation, 1); }, false);
        }
    }
        
    var informationDiv = document.getElementById('information');
    if (informationDiv) {
        var listElements = informationDiv.getElementsByTagName('li');
        if (listElements.length > 0) {
            cityInformation();
        }
    }
}

init();