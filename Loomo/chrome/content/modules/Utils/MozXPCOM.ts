//======================================================================================//
//======================================================================================//
//																						//
//									JS Module: MozXPCOM									//
//																						//
// This module contains contract-id's and constructors for Mozilla components			//
//======================================================================================//
//======================================================================================//

// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================


//======================================================================================//
// Some standard constants
//======================================================================================//
var C = Components;
var Cc = Components.classes;
var CcID = Components.classesByID;
var Ci = Components.interfaces;
var Cr = Components.results;
var Cu = Components.utils;
var CCtor = Components.Constructor;


//======================================================================================//
// Constants for CID's, contract ID's, etc
//======================================================================================//

export var CON = {
	nsAppStartup		: "@mozilla.org/toolkit/app-startup;1",
	nsClipboard			: "@mozilla.org/widget/clipboard;1",
	nsStandardURL		: "@mozilla.org/network/standard-url;1"
}


//MOZ.CID_STR.nsChromeProtocolHandler			= "{61ba33c0-3031-11d3-8cd0-0060b0fc14a3}";			

//======================================================================================//
// Constructors
//======================================================================================//
export var StandardURL = CCtor(CON.nsStandardURL, Ci.nsIURI);