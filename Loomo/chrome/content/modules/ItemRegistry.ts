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
	* @param   {string}     scheme            URI scheme
	* @param   {function}   constructorFunc   Constructor to save
	*/
export function registerItemConstructor(scheme: string, constructorFunc: Function)
{
	_constructorFuncsByScheme[scheme] = constructorFunc;
}
	
/**
* Returns the constructor function for items of the given scheme
* 
* @param   {string}   scheme   URI scheme to search for
* 
* @returns {function}   Constructor function
*/
export function getItemConstructor(scheme: string) : Function
{
	return _constructorFuncsByScheme[scheme];
}
	
export function createItemFromURI(URI: Components.interfaces.nsIURI): MItem.Item
{
	return new (_constructorFuncsByScheme[URI.scheme])(URI);
}
	
export function createItemFromURISpec(URIspec: string): MItem.Item
{
	// TODO: extract scheme on our own
	return createItemFromURI(Services.io.newURI(URIspec, null, null));
}
