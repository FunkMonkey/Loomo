//======================================================================================//
//======================================================================================//
//																						//
//									FileView: List										//
//																						//
// This script handles the fileview for the type list									//
//======================================================================================//
//======================================================================================//

// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
var require = getRequireForContentScript(document);
// ==========================================================================


// Includes
import LogUtils = module("../../modules/Utils/log");
import MSimpleList = module("../../bindings/itemview/SimpleList");
import ItemRegistry = module("../../modules/ItemRegistry");
import Fibro = module("../../modules/Fibro");
import MItem = module("../../modules/Item");

Components.utils.import("resource://gre/modules/Services.jsm");

/**
 * Alerts a caught Error/Exception
 *
 * @param  e   Error to alert
 */
function errorAlert(e){
	alert("We are sorry. There was an error.\n\n" + LogUtils.formatError(e));
}

/**
 * Sets the favicon
 *
 * @param    item    Item to get favicon from
 */
function setFavicon(item: MItem.Item)
{
	var favicon = document.getElementById("favicon");
	var newFavicon = <HTMLElement>favicon.cloneNode(true);
	item.getIconURIString(16).then(function(res){
			newFavicon.setAttribute('href', res);
			favicon.parentNode.replaceChild(newFavicon,favicon);
		}, function(e){
			errorAlert(e);
		});
}

/**
 * Called when the fileview wants to open a URI
 *    - depending on event, the URI will be opened in a new browser tab
 *
 * @param   urispec   URIspec to open
 * @param   event     Event that lead to opening
 */
function openURICallback(urispec:string, event: Event)
{
	// get the current browser window and open the link
	var win = <any>Services.wm.getMostRecentWindow('navigator:browser');
	win.openUILinkIn(urispec, win.whereToOpenLink(event));
}

/**
 * Initializes the fileview
 */
function initFileView()
{
		// set the favicon
		setFavicon(item);
		
		// create a simple list
		var view = <MSimpleList.ISimpleListElement>document.getElementById("itemview_simple");
		view.impl.openURICallback = openURICallback;
		
		// get the directory entries
		console.time("entries");
		item.getDirectoryEntries().then(function(res){
				console.timeEnd("entries");
				console.time("entriesRendered");
				view.impl.loadFromItemGroup(res);
				console.timeEnd("entriesRendered");
			}, function(e){
				errorAlert(e);
			});
}

// create an item based on the window location
var item = ItemRegistry.createItemFromURISpec(window.location.href);

// set the title
document.title = item.getDisplayName();

// setup the onload-handler
window.addEventListener("load", function(e) { initFileView(); }, false); 





