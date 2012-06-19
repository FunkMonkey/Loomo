
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
	
	logAllProperties: function logAllProperties(object)
	{
		var chain = [];
		
		/*if(options.ownPropsOnly)
		{
			chain.push(from);
		}
		else*/
		{
			// creating the inheritence chain
			var currObj = object;
			while(currObj)
			{
				chain.push(currObj);
				
				// go down further in the inheritence chain
				// don't copy Object.prototype
				var proto = Object.getPrototypeOf(currObj);
				
				// dirty hack, cannot check for Object.prototype sometimes (f. ex. in different js contexts)
				// thus checking for a member
				currObj = proto.hasOwnProperty("hasOwnProperty") ? null : proto; 
			}
		}
		
		var allProps = {};
		
		// go through the inheritence chain
		for(var i = 0; i < chain.length; ++i)
		{
			var propNames = Object.getOwnPropertyNames(chain[i]);
			
			// copy all property descriptors over to "to"
			for(var j = 0; j < propNames.length; ++j)
			{
				// don't copy, if prop has already been borrowed from up in the chain
				if(allProps[propNames[j]])
					continue;
				
				allProps[propNames[j]] = true;
			}
		}
		
		var str = "";
		for(var propName in allProps)
		{
			var sub = (object[propName].toString == null) ? "[Object]" : ""+ object[propName];
			
			str += propName + ": " + sub + "\n";
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