// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================

import LogUtils = module("Utils/log");

import Services = module("Utils/Services2");

// Test
//Components.utils.import("chrome://fibro/content/modules/Filesystem/FileOperations.jsm");

//======================================================================================//
// Filebrowser																			//
//======================================================================================//

export function quitApp(/* in boolean */aForceQuit)
{
	// eAttemptQuit will try to close each XUL window, but the XUL window can cancel the quit
	// process if there is unsaved data. eForceQuit will quit no matter what.
	var quitSeverity = aForceQuit ? Components.interfaces.nsIAppStartup.eForceQuit : Components.interfaces.nsIAppStartup.eAttemptQuit;
	Services.appStartup.quit(quitSeverity);
}
	
/**
	* Logs the given message
	* 
	* @param   {string}   message   Message to log
	*/
export function log(message)
{
	LogUtils.log(message);
}

// setting up
//Components.utils.import("chrome://fibro/content/modules/Filesystem/LocalFile.jsm");
import LocalFile = module ("Filesystem/LocalFile");
var __XX = LocalFile; // otherwise the import will get lost

import LocalFileGroup = module ("Filesystem/LocalFileGroup");
var __XX2 = LocalFileGroup; // otherwise the import will get lost
