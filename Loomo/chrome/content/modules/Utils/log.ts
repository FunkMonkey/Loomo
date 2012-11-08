// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================

var consoleService : Components.interfaces.nsIConsoleService = Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService);

export var logOptions = {
    useFirebug: true,
    firebugLog: null,
    useJSConsole: true
}

/**
 * Logs a string message
 * 
 * @param   {string} str Message to log
 */
export function log(str)
{
	if(logOptions.useJSConsole)
	{
		if(str == null)
			str = "" + str;
		else if(str === "")
			str = " ";
		consoleService.logStringMessage(str);
	}
	
    // TODO: fix
	//if(logOptions.useFirebug && logOptions.firebugLog)
	//	logOptions.firebugLog(str);
}


/**
* Logs the given object
* 
* @param   {Object}    object      Object to log
* @param   {boolean}   recursive   Log recursively
*/
export function logObject(object: Object, recursive: bool) {
	// TODO: recursive
	var str = "";
	for(var member in object)
	{
		var sub = (object[member].toString == null) ? "[Object]" : ""+ object[member];
			
		str += member + ": " + sub + "\n";
	}
		
	log(str);
}
	
export function logAllProperties(object: Object) {
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
}

export function formatError(e) {
	if(e && typeof(e) === "object" && e.message)
		return (e.fileName + "(" + e.lineNumber + "): " + e.name + " " + e.message + "\n\n" + e.stack);
	else
		return "" + e;
}

export function logError(e) {
	log(this.formatError(e));
}

// TODO: TSBUG: fix Error casting, when this bug is fixed: 
// http://typescript.codeplex.com/workitem/176
/**
* Logs the stack of a given error
*    - if no error is given, it will log the stack of the call to logStack
*
* @param   {Error}    [e]      Exception to log
*/
export function logStack(e: Error) {
	if(e)
		log((<any>e).stack)
	else
	{
		log((<any>(new Error())).stack)
	}
}
