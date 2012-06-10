//======================================================================================//
//======================================================================================//
//																						//
//									JS Module: MozXPCOM									//
//																						//
// This module contains contract-id's and constructors for Mozilla components			//
//======================================================================================//
//======================================================================================//

var EXPORTED_SYMBOLS = ["MOZ"];


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


//======================================================================================//
// Constants for CID's, contract ID's, etc												//
//======================================================================================//

var MOZ =
{
	CID: {},
	CID_STR: {},
	CON: {}
};


//——————————————————————————————————————————————————————————————————————————————————————//
// Identifiers for Mozilla																//
//——————————————————————————————————————————————————————————————————————————————————————//

MOZ.CON.nsAppStartup						= "@mozilla.org/toolkit/app-startup;1";

MOZ.CON.nsArray								= "@mozilla.org/array;1";
MOZ.Array									= CCtor(MOZ.CON.nsArray, Ci.nsIArray);

MOZ.CID_STR.nsChromeProtocolHandler			= "{61ba33c0-3031-11d3-8cd0-0060b0fc14a3}";			

MOZ.CON.nsClipboard							= "@mozilla.org/widget/clipboard;1";

MOZ.CID_STR.nsIOService						= "{9ac9e770-18bc-11d3-9337-00104ba0fd40}";						
MOZ.CON.nsIOService							= "@mozilla.org/network/io-service;1";

MOZ.CON.nsLocalFile							= "@mozilla.org/file/local;1";
MOZ.LocalFile								= CCtor(MOZ.CON.nsLocalFile, Ci.nsILocalFile);

MOZ.CON.nsMutableArray						= "@mozilla.org/array;1";
MOZ.MutableArray							= CCtor(MOZ.CON.nsMutableArray, Ci.nsIMutableArray);

MOZ.CON.nsPrefService						= "@mozilla.org/preferences-service;1";
						
MOZ.CON.nsSimpleURI							= "@mozilla.org/network/simple-uri;1";
MOZ.SimpleURI								= CCtor(MOZ.CON.nsSimpleURI, Ci.nsIURI);
MOZ.CON.nsStandardURL						= "@mozilla.org/network/standard-url;1";
MOZ.StandardURL								= CCtor(MOZ.CON.nsStandardURL, Ci.nsIURI);

MOZ.CON.nsSupportsString					= "@mozilla.org/supports-string;1";
MOZ.SupportsString							= CCtor(MOZ.CON.nsSupportsString, Ci.nsISupportsString);

MOZ.CON.nsTransferable						= "@mozilla.org/widget/transferable;1";
MOZ.Transferable							= CCtor(MOZ.CON.nsTransferable, Ci.nsITransferable);