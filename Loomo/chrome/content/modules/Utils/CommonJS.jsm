var EXPORTED_SYMBOLS = ["initCommonJSModule", "getRequireForContentScript", "emptyRequire"];

/**
 * Initializes the global object of a Mozilla JS Module to be a CommonJS module
 *    - adds require and exports
 *
 * @param  {Object}   global   Global object of Mozilla JS module
 */
function initCommonJSModule(global){

	// adding CommonJS require
	global.require = function require(path) {
			if (!("__URI__" in global))
			  throw Error("require may only be used from a JSM, and its first argument "+
						  "must be that JSM's global object (hint: use this)");
			let uri = global.__URI__;
			let i = uri.lastIndexOf("/");
			var res = {};
			Components.utils.import(uri.substring(0, i+1) + path + ".js", res);
			return res;
		};
	
	// adding the symbols needes for Mozilla JS modules
	global.EXPORTED_SYMBOLS = [];
	
	// Proxy handler used for CommonJS exports that will automatically adjust EXPORTED_SYMBOLS
	var handler = {
		set: function(target, name, value){
			if(global.EXPORTED_SYMBOLS.indexOf(name) === -1)
				global.EXPORTED_SYMBOLS.push(name);
			target[name] = value;
			return true;
		}
	};
	
	// adding CommonJS exports
	global.exports = new Proxy(global, handler);
	global.module = {};
	global.module.exports = global.exports;
}

/**
 * Returns the URI of the current script
 *
 * @param  {Document}   doc   Document the script belongs to
 *
 * @return {string}   URI of the current script
 */
function getCurrentScriptURI(doc) {
	var scripts = doc.getElementsByTagName('script');
    var index = scripts.length - 1;
    var myScript = scripts[index];
    return myScript.getAttribute("src");
}

/**
 * Returns the require function for the current chrome script
 *    - can be used to require CommonJS modules
 *
 * @param  {Document}   doc   Document the script belongs to
 *
 * @return {Function}    Require function to load CommonJS modules
 */
function getRequireForContentScript(doc){

	var uri = getCurrentScriptURI(doc);
	var start = uri.substring(0, uri.lastIndexOf("/") + 1);

	return function require(path) {
			var res = {};
			Components.utils.import(start + path + ".js", res);
			return res;
		};
}

function emptyRequire(){ 
	return {}; 
}