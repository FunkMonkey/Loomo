//======================================================================================//
//======================================================================================//
//																						//
//									FileView: List										//
//																						//
// This script handles the fileview for the type list									//
//======================================================================================//
//======================================================================================//


// Includes
//Cu.import("resource://filebrowser/Filebrowser.jsm");
//Cu.import("resource://filebrowser/Utilities/MozServices.jsm");
//Cu.import("resource://filebrowser/AccessCountRule.jsm");

Components.utils.import("chrome://fibro/content/modules/Utils/log.jsm");
Components.utils.import("chrome://fibro/content/modules/Fibro.jsm");
Components.utils.import("chrome://fibro/content/modules/ItemRegistry.jsm");

Components.utils.import("chrome://fibro/content/modules/Filesystem/LocalFileGroup.jsm");

Components.utils.import("chrome://fibro/content/modules/Utils/Services.jsm");

function errorAlert(e){
	alert("We are sorry. There was an error.\n\n" + LogUtils.formatError(e));
}

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
	item.getIconURIString(16).then(function(res){
			newFavicon.setAttribute('href', res);
			favicon.parentNode.replaceChild(newFavicon,favicon);
		}, function(e){
			errorAlert(e);
		});
}


function openURICallback(urispec, event)
{
	var win = Services.wm.getMostRecentWindow('navigator:browser');
	win.openUILinkIn(urispec, win.whereToOpenLink(event));
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
		//var group = new LocalFileGroup(item, {includeHidden: true}); // TODO: make independent from LocalFileGroup, item.getChildren()
		//loadTimer.stop();
		//
		//
		

		
		var view = document.getElementById("itemview_simple");
		view.impl.openURICallback = openURICallback;
		
		console.time("entries");
		item.getDirectoryEntries().then(function(res){
				console.timeEnd("entries");
				console.time("entriesRendered");
				view.impl.loadFromItemGroup(res);
				console.timeEnd("entriesRendered");
			}, function(e){
				errorAlert(e);
			});
		
		//var viewTimer = new Timer("loadView");
		
		
		//viewTimer.stop();
}

// setup the onload-handler
window.addEventListener("load", function(e) { initFileView(); }, false); 

var item = ItemRegistry.createItemFromURISpec(window.location.href);

// set the title
document.title = item.getDisplayName();




