//======================================================================================//
//======================================================================================//
//																						//
//								JS Module: MozServices									//
//																						//
// This module contains services that are frequently used for easy access				//
//======================================================================================//
//======================================================================================//

var EXPORTED_SYMBOLS = ["Services"]

//======================================================================================//
// Some standard constants																//
//======================================================================================//
const C = Components;
const Cc = Components.classes;
const CcID = Components.classesByID;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;
const CCtor = Components.Constructor;

// Includes
Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("chrome://fibro/content/modules/Utils/MozXPCOM.jsm");

// more Services
Services.appStartup = Cc[MOZ.CON.nsAppStartup].getService(Ci.nsIAppStartup);

// Protocols
Services.FileProtocolHandler = Services.io.getProtocolHandler("file").QueryInterface(Ci.nsIProtocolHandler);

// for xfile this is a little more complicated. wrapping it in a function, so the xfile protocol handler will only be created when needed
Services._XFileProtocolHandler = null;
Services.getXFileProtocolHandler = function getXFileProtocolHandler()
{
	if(!this._XFileProtocolHandler)
		this._XFileProtocolHandler = Services.io.getProtocolHandler("xfile").QueryInterface(Ci.nsIProtocolHandler);
		
	return this._XFileProtocolHandler;
}

Object.defineProperty(Services, "XFileProtocolHandler", { get: Services.getXFileProtocolHandler, configurable: true, enumerable: true });

