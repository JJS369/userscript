// ==UserScript==
// @name            BinNews Search File With Binsearch, Newzleech, and more
// @namespace      Gatsu (modified by Shaddock)
// @description    Add a link to BinSearch or other newsgroups search
// @include        http://www.binnews.in/_bin/*
// ==/UserScript==


/* styles CSS */
var sty = document.styleSheets[document.styleSheets.length - 1];
	sty.insertRule("tr.searchLinkRow td.searchLinkCell div.binLinks {display:inline; visibility:hidden; white-space:nowrap; font-weight:bold;}", 0);
	sty.insertRule("tr.searchLinkRow:hover td.searchLinkCell div.binLinks {visibility:visible;}", 0);
	sty.insertRule("tr.searchLinkRow td.searchLinkCell a.binLink{display:inline; outline:none; position:relative; padding:1px; font-weight:bold; vertical-align:middle;}", 0);
	sty.insertRule("tr.searchLinkRow td.searchLinkCell a.binLink img {border:0; vertical-align:middle;}", 0);
	sty.insertRule("tr.searchLinkRow td.searchLinkCell a.binLink span {display:none; position:absolute; white-space:nowrap; padding:2px; left:20px; top:-25px; z-index:999; color:#000; background:#FFFFAA; border:1px solid #000; font-weight:normal}", 0);
	sty.insertRule("tr.searchLinkRow td.searchLinkCell a.binLink:hover span {display:block}", 0);

/* styles d'un lien par defaut */	
var defaultStyles = {
	color : '#F5F5F5',
	backgroundColor : 'black',
	textDecoration : 'underline'
}

function generateLink(elm, str, label, title, url, styles, imgStyle) {
	
	var div = elm.getElementsByTagName('div');
	if (div.length>0) {
		div = div[0];
		if (!div.className.match(/\bbinLinks/i)) {
			div = null;
		}
	}
	if (!div || div.length==0) {
		div = elm.appendChild(document.createElement('div'));
		div.className = 'binLinks';
	}
	
	//initialize les styles du lien
	styles = styles || {};
	for (var i in defaultStyles) {
		if (!styles[i]) {
			styles[i] = defaultStyles[i];
		};
	}
	
	imgStyle = imgStyle || {};
	div.appendChild(document.createTextNode(' ')); //espace
	var a = document.createElement('a');
	a.target = '_blank';
	if (label.match(/\bhttp\b/)) {
		a.innerHTML = '<img src="' + label + '" />';
		a.style.textDecoration = 'none';
		if (imgStyle) {
			var img = a.getElementsByTagName('img')[0];
			for (var i in imgStyle) {
				img.style[i] = imgStyle[i];
			}
		}
	} else {
		a.innerHTML = label;
		for (var i in styles) { //applique les styles
			a.style[i] = styles[i];
		}
	}
	a.className = 'binLink';
	var str = escape(str);
	a.href = url.replace(/\$\$STR\$\$/g,str);
	div.appendChild(a);
	var span = a.appendChild(document.createElement('span'));
	span.innerHTML = title;
}

//generation des liens
var allLinks = document.getElementsByTagName('a');
var linksArray = []; //array pour eviter de se retrouver avec une nodeList dynamique, parce qu'en plus on va rajouter des liens dans la page
for (var i=0; i<allLinks.length; i++) {
	linksArray.push(allLinks[i]);
}


//parcours de tous les liens
linksArray.forEach(function(link) {
	if (link.hasAttribute('href') && link.getAttribute('href').match(/(ng|cat)_id=/)) {
		//on remonte jusqu'au TD
		var td = link;
		while(td && td.nodeName!="TD") {
			td = td.parentNode;
		}
		
		if (!td) return;
		var newTd = td.parentNode.cells[td.cellIndex+1];
		//passe au td suivant : 
		if (!newTd) {
			while(td) {
				if (td.parentNode.className.match(/\bligne/)) {
					break;
				}
				td = td.parentNode;
			}
			newTd = td.parentNode.cells[td.cellIndex+1];
		}
		if (!newTd) return;
		//ajout du lien
		//on teste si le lien n'existe pas déjà 
		td = newTd;
		if (td.getAttribute('title')!='binName') {
			td.setAttribute('title', 'binName');
			td.parentNode.className+= ' searchLinkRow';
			td.className+= ' searchLinkCell';
			var str = td.innerHTML;
			
			
	/**
	 * ici il suffit de rajouter le moteur de news que l'on veut, il ne faut pas toucher aux deux premiers parametres (td et str), 
	 * on peut aussi appliquer un dictionnaire (hashmap)  de styles CSS : { color:'red',  backgroundColor: 'blue', fontWeight:'bold'}, si certains styles ne sont pas présents, ils seront pris depuis le dictionnaire de styles par défaut
	 * si a la place du texte à afficher on met une URL vers une image, c'est l'url qui sera prise en compte
	 * utilisation : 
	*  generateLink(td, str, 'texte a affiche ou URL', 'texte infobulle au dessus du lien', 'url de recherche pour le moteur avec $$STR$$ qui est la chaine qui sera remplacée par str', { color:'#FFF', backgroundColor:'black'} )
	*/
	
	generateLink(td, str, 'http://binsearch.info/favicon.ico', 'BinSearch', 'http://binsearch.info/?max=250&adv_age=&server=&q=$$STR$$');
	generateLink(td, str, 'BSO', 'BinSearch Other groups', 'http://binsearch.info/?max=250&adv_age=&server=2&q=$$STR$$');
	generateLink(td, str, 'http://img4.hostingpics.net/pics/534119yabsearch.png/favicon.ico', 'Yabse', 'http://www.yabsearch.nl/search/$$STR$$?co=y&results=200&sizemax=0&sizemin=0', {backgroundColor:'orange', color:'white'}, {width:'18px', height:'16px'});
	generateLink(td, str, 'http://www.nzbindex.nl/favicon.ico', 'NzbIndex', 'http://www.nzbindex.nl/search/?q=$$STR$$');
	generateLink(td, str, 'http://www.nzbclub.com/index.aspx/favicon.ico', 'NzbClub', 'http://www.nzbclub.com/search.aspx?q==$$STR$$', {backgroundColor:'red'});
	generateLink(td, str, 'http://www.nzbs.org/favicon.ico', 'NZBOrg (Enregistrement)', 'http://www.nzbs.org/index.php?action=search&q=$$STR$$', {backgroundColor:'black'});
	generateLink(td, str, 'http://nzbmatrix.com/favicon.ico', 'NzbMatix (Enregistrement)', 'http://nzbmatrix.com/nzb-search.php?search=$$STR$$');
	generateLink(td, str, 'http://www.mysterbin.com/favicon.ico', 'MysterBin', 'http://www.mysterbin.com/search?q=$$STR$$');
		}
	};
});



  
  
  
  