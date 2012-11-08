var EXPORTED_SYMBOLS = ["initCommonJSModule", "getRequireForContentScript"];

function initCommonJSModule(global){
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
		
	global.EXPORTED_SYMBOLS = [];
	
	var handler = {
		set: function(target, name, value){
			if(global.EXPORTED_SYMBOLS.indexOf(name) === -1)
				global.EXPORTED_SYMBOLS.push(name);
			target[name] = value;
			return true;
		}
	};
	
	global.exports = new Proxy(global, handler);
	global.module = {};
	global.module.exports = global.exports;
}

function getCurrentScriptURI(doc) {
	var scripts = doc.getElementsByTagName('script');
    var index = scripts.length - 1;
    var myScript = scripts[index];
    return myScript.getAttribute("src");
}

function getRequireForContentScript(doc){

	var uri = getCurrentScriptURI(doc);
	var start = uri.substring(0, uri.lastIndexOf("/") + 1);

	return function require(path) {
			var res = {};
			Components.utils.import(start + path + ".js", res);
			return res;
		};
}