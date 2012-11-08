//======================================================================================//
//======================================================================================//
//																						//
//								JS Module: MozServices									//
//																						//
// This module contains services that are frequently used for easy access				//
//======================================================================================//
//======================================================================================//

// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================

//======================================================================================//
// Some standard constants																//
//======================================================================================//
var  C = Components;
var  Cc = Components.classes;
var  CcID = Components.classesByID;
var  Ci = Components.interfaces;
var  Cr = Components.results;
var  Cu = Components.utils;
var CCtor = Components.Constructor;

// Includes
Components.utils.import("resource://gre/modules/Services.jsm");
export var services = Services;

import MozXPCOM = module("MozXPCOM");


// more Services
export var appStartup : Components.interfaces.nsIAppStartup = Cc[MozXPCOM.CON.nsAppStartup].getService(Ci.nsIAppStartup);

// Protocols
export var FileProtocolHandler = Services.io.getProtocolHandler("file").QueryInterface(Ci.nsIProtocolHandler);

// for xfile this is a little more complicated. wrapping it in a function, so the xfile protocol handler will only be created when needed
var _XFileProtocolHandler = null;
function getXFileProtocolHandler(): Components.interfaces.nsIProtocolHandler {
    if (!this._XFileProtocolHandler)
        this._XFileProtocolHandler = Services.io.getProtocolHandler("xfile").QueryInterface(Ci.nsIProtocolHandler);

    return this._XFileProtocolHandler;
}

export var XFileProtocolHandler: Components.interfaces.nsIProtocolHandler = getXFileProtocolHandler();
//Object.defineProperty(Services, "XFileProtocolHandler", { get: Services.getXFileProtocolHandler, configurable: true, enumerable: true });

