
var EXPORTED_SYMBOLS = ["log", "LogUtils"];

const consoleService = Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService);

/**
 * Logs a string message
 * 
 * @param   {string} str Message to log
 */
function log(str)
{
	if(log.useJSConsole)
	{
		if(str == null)
			str = "" + str;
		else if(str === "")
			str = " ";
		consoleService.logStringMessage(str);
	}
	
	if(log.useFirebug && log.firebugLog)
		log.firebugLog(str);
}

log.useFirebug = true;
log.firebugLog = null;
log.useJSConsole = true;

/**
 * Provides logging utilities
 *
 * @type Object
 */
var LogUtils = {
	/**
	 * Logs the given object
	 * 
	 * @param   {Object}    object      Object to log
	 * @param   {boolean}   recursive   Log recursively
	 */
	logObject: function logObject(object, recursive)
	{
		// TODO: recursive
		var str = "";
		for(var member in object)
		{
			var sub = (object[member].toString == null) ? "[Object]" : ""+ object[member];
			
			str += member + ": " + sub + "\n";
		}
		
		log(str);
	},
	
	/**
	 * Logs the stack of a given error
	 *    - if no error is given, it will log the stack of the call to logStack
	 *
	 * @param   {Error}    [e]      Exception to log
	 */
	logStack: function logStack(e)
	{
		if(e)
			log(e.stack)
		else
		{
			try{throw new Error()}catch(e){log(e.stack)}
		}
	}, 
	
	
}