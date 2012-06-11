//======================================================================================//
//======================================================================================//
//																						//
//										Filebrowser										//
//																						//
// This is the base module of the Filebrowser, which can be used from the JS side		//
//======================================================================================//
//======================================================================================//

var EXPORTED_SYMBOLS = ["Fibro"];

Components.utils.import("chrome://fibro/content/modules/Utils/log.jsm");
Components.utils.import("chrome://fibro/content/modules/Utils/Services.jsm");
Components.utils.import("chrome://fibro/content/modules/Utils/MozXPCOM.jsm");

//======================================================================================//
// Filebrowser																			//
//======================================================================================//
var Fibro = 
{
	quitApp: function quitApp(/* in boolean */aForceQuit)
	{
		// eAttemptQuit will try to close each XUL window, but the XUL window can cancel the quit
		// process if there is unsaved data. eForceQuit will quit no matter what.
		var quitSeverity = aForceQuit ? Ci.nsIAppStartup.eForceQuit : Ci.nsIAppStartup.eAttemptQuit;
		Services.appStartup.quit(quitSeverity);
	},
	
	/**
	 * Logs the given message
	 * 
	 * @param   {string}   message   Message to log
	 */
	log: function log(message)
	{
		log(message);
	}, 
		


};
