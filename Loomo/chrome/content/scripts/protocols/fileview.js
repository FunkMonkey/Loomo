//======================================================================================//
//======================================================================================//
//																						//
//									FileView: List										//
//																						//
// This script handles the fileview for the type list									//
//======================================================================================//
//======================================================================================//

var Cu = Components.utils;

// Includes
//Cu.import("resource://filebrowser/Filebrowser.jsm");
//Cu.import("resource://filebrowser/Utilities/MozServices.jsm");
//Cu.import("resource://filebrowser/AccessCountRule.jsm");
Cu.import("chrome://fibro/content/scripts/modules/Logging.jsm");
Cu.import("chrome://fibro/content/scripts/modules/Timer.jsm");

Cu.import("chrome://fibro/content/scripts/modules/Fibro.jsm");
Cu.import("chrome://fibro/content/scripts/modules/Group.jsm");

Cu.import("chrome://fibro/content/scripts/modules/LocalFileGroup.jsm");

//——————————————————————————————————————————————————————————————————————————————————————
/// Sets the favicon using the given FileGroupItem
///
/// @param	aItem
///			FileGroupItem to retrieve the favicon from
//——————————————————————————————————————————————————————————————————————————————————————
function setFavicon(item)
{
	var favicon = document.getElementById("favicon");
	var newFavicon = favicon.cloneNode(true);
	newFavicon.setAttribute('href', item.getIconURIString(16));
	favicon.parentNode.replaceChild(newFavicon,favicon);
}

//——————————————————————————————————————————————————————————————————————————————————————
/// Called, when the page has finished loading
//——————————————————————————————————————————————————————————————————————————————————————
function initFileView()
{
	// set the favicon
	setFavicon(item);
	
	// create a filegroup and load it
	//var loadTimer = new Timer("loadGroup");
	var group = new LocalFileGroup(item, {includeHidden: true}); // TODO: make independent from LocalFileGroup
	//loadTimer.stop();
	
	//var viewTimer = new Timer("loadView");
	var view = document.getElementById("itemview_simple");
	view.loadFromItemGroup(group);
	//viewTimer.stop();
	
	/*var filegroup = Filebrowser.fileGroupManager.createFileGroup(item);
	var fileviewcontainer = document.getElementById("fileview_container");
	fileviewcontainer.fileGroup = filegroup;
	
	fileviewcontainer.view.loadFromFileGroup(filegroup);
	
	var event = document.createEvent("Events");
	event.initEvent("FileviewLoaded", true, true);
	document.dispatchEvent(event);*/
}

// setup the onload-handler
window.addEventListener("load", function(e) { initFileView(); }, false); 

var item = Fibro.createItemFromURISpec(window.location.href);

// set the title
document.title = item.getDisplayName();




