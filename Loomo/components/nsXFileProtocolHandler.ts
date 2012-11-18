//======================================================================================//
//======================================================================================//
//																						//
//								XPCOM: nsXFileProtocolHandler							//
//																						//
// The protocol handler that handles "xfile" URI's										//
//======================================================================================//
//======================================================================================//

// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../chrome/content/Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
var require = emptyRequire;
// ==========================================================================



Components.utils.import("chrome://fibro/content/modules/Utils/log.js");

// Includes
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource://gre/modules/Services.jsm");


import MozXPCOM = module("../chrome/content/modules/Utils/MozXPCOM");
Components.utils.import("chrome://fibro/content/modules/Utils/MozXPCOM.js", MozXPCOM);

import Fibro = module("../chrome/content/modules/Fibro");
Components.utils.import("chrome://fibro/content/modules/Fibro.js", Fibro);

import ItemRegistry = module("../chrome/content/modules/ItemRegistry");
Components.utils.import("chrome://fibro/content/modules/ItemRegistry.js", ItemRegistry);


/* Temporary until Bug XXX was fixed */
var C = Components;
var Ci = Components.interfaces;
var nsXFileProtocolHandler_CID_STR      = "{789409b9-2e3b-4682-a5d1-71ca80a76456}";			
var nsXFileProtocolHandler_CID          = C.ID(nsXFileProtocolHandler_CID_STR);				
var nsXFileProtocolHandler_CON_ID       = "@mozilla.org/network/protocol;1?name=xfile";	
var nsXFileProtocolHandler_DESC         = "XFile Protocol Handler";							
var nsXFileProtocolHandler_URI_PREFIX   = "xfile";		


function nsXFileProtocolHandler() {

}

nsXFileProtocolHandler.prototype = {
	
	// XPCOM Stuff
	classDescription:	nsXFileProtocolHandler_DESC,
	classID:			nsXFileProtocolHandler_CID,
	contractID:			nsXFileProtocolHandler_CON_ID,
	QueryInterface:		XPCOMUtils.generateQI([Ci.nsIProtocolHandler, (<any>Ci).nsIXFileProtocolHandler]),


	scheme:			nsXFileProtocolHandler_URI_PREFIX,
	defaultPort:	-1,
	protocolFlags:	/* Ci.nsIProtocolHandler.URI_NORELATIVE |*/ Ci.nsIProtocolHandler.URI_NOAUTH | Ci.nsIProtocolHandler.URI_IS_LOCAL_FILE,


	/**
	 * Returns whether the port is supported
	 *
	 * @param   port     Tha port
	 * @param   scheme   Da scheme
	 *
	 * @return   True if port is supported, otherwise false
	 */
	allowPort: function allowPort(port: number, scheme: string): bool {
		return false;
	},
	

	/**
	 * Creates a new URI for this protocol
	 *
	 * @param   aSpec            URI specification
	 * @param   aOriginCharset   
	 * @param   aBaseURI         
	 *
	 * @return    The new URI
	 */
	newURI: function newURI(aSpec: string, aOriginCharset: string, aBaseURI: Components.interfaces.nsIURI) {
		var uri = new MozXPCOM.StandardURL();
		uri.spec = aSpec;
		return uri;
	},

	/**
	 * Creates a new channel
	 *    - simply forwards a chrome channel
	 *
	 * @param   aURI   URI to load
	 *
	 * @return   Newly created channel
	 */
	newChannel: function(aURI: Components.interfaces.nsIURI): Components.interfaces.nsIChannel {

		// get the file that corresponds to the URI
		var file = ItemRegistry.createItemFromURI(aURI);
		
		// if file exists, show fileview ...
		// 

		var URIspec = "";

		try {
			// TODO: check for file existence
			//if(file.xpcomFile.exists())
			{
				URIspec = "chrome://fibro/content/ui/protocols/fileview.xul";
			}
			// ... otherwise show errorpage
			// else
			// {
			// 	URIspec = "chrome://fibro/content/ui/protocols/error_page_file_not_found.xul";
			// }

		} catch(e) {
			URIspec = "chrome://fibro/content/ui/protocols/error_page_file_not_found.xul";
			Fibro.log(e);
		}

		// create a URI from the string and create a channel based on that URI
		var ext_uri = Services.io.newURI(URIspec, null, null);
		var ext_channel = Services.io.newChannelFromURI(ext_uri);
		

		return ext_channel;
		
		/*var ext_uri = Services.io.newURI("about:config", null, null);
		var ext_channel = Services.io.newChannelFromURI(ext_uri);
		
		return ext_channel;*/
	}

};


// XPCOM Registration
var NSGetFactory = XPCOMUtils.generateNSGetFactory([nsXFileProtocolHandler]);