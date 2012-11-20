// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================

Components.utils.import("resource://gre/modules/Services.jsm");

import MItem = module("Item");

	
var _constructorFuncsByScheme = {};
	
/**
 * Registers the constructor function for an item
 * 
 * @param   scheme            URI scheme
 * @param   constructorFunc   Constructor to save
 */
export function registerItemConstructor(scheme: string, constructorFunc: Function) {
	_constructorFuncsByScheme[scheme] = constructorFunc;
}
	
/**
 * Returns the constructor function for items of the given scheme
 * 
 * @param   scheme   URI scheme to search for
 * 
 * @returns   Constructor function
 */
export function getItemConstructor(scheme: string) : Function {
	return _constructorFuncsByScheme[scheme];
}

/**
 * Creates an Item from the given URI
 *
 * @param  URI  URI to create Item from
 *
 * @return   Newly created Item
 */
export function createItemFromURI(URI: Components.interfaces.nsIURI): MItem.Item {
	return new (_constructorFuncsByScheme[URI.scheme])(URI);
}

/**
 * Creates an Item from the given URI spec
 *
 * @param  URIspec  URIspec to create Item from
 *
 * @return   Newly created Item
 */
export function createItemFromURISpec(URIspec: string): MItem.Item {
	var scheme = URIspec.substring(0, URIspec.indexOf(":"));
	return new (_constructorFuncsByScheme[scheme])(URIspec);
}