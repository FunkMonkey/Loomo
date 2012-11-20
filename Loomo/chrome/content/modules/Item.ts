// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================

///<reference path='../MozPromise.d.ts' />
Components.utils.import("resource://gre/modules/commonjs/promise/core.js");


import MGroup = module("Group");

/**
 * Represents an Item
 */
export class Item {

	/**
	 * URI specification of this Item (f.ex. xfile:///C:/Windows)
	 */
	URIspec: string;

	// TODO: remove???
	/**
	 * XPCOM URI
	 */
	_URI: Components.interfaces.nsIURI;

	/**
	 * Alternative name for displaying
	 */
	alternativeDisplayName: string;

	// TODO: use interface
	/**
	 * Alternative icons for displaying
	 */
	alternativeIconURIs: any;

	/**
	 * Represents a container for views
	 *
	 * @constructor
	 * @param   URIorSpec   URI or URIspec for this item
	 */
	constructor (URIorSpec: number);
	constructor (URIorSpec: string);
	constructor (URIorSpec: Components.interfaces.nsIURI);
	constructor (URIorSpec: any) {
		
		// added to ignore super as first constructor statement
		if(URIorSpec === -1)
			return null;

		this.URIspec = "";
		this._URI = null;
		this.alternativeDisplayName = "";
		this.alternativeIconURIs = {};
	
		// the param should only be undefined if another Constructor already handles it
		if(URIorSpec === undefined) {
			throw new Error("Constructor needs exactly one parameter that can be a nsIURI or a string representing a URI spec!");
		} else if(typeof(URIorSpec) === "string") { // TODO: perform URI check?
			this.URIspec = URIorSpec;
		} else if(URIorSpec instanceof Components.interfaces.nsIURI) {
			this._URI = URIorSpec;
			this.URIspec = this._URI.spec;
		} else {
			throw new Error("unsupported parameter. Please pass a nsIURI or a string representing a URI spec!");
		}
	}

	// TODO: remove?
	/**
	 * XPCOM URI
	 *    - created based on URIspec when needed the first time
	 */
	get URI() {
		if(!this._URI)
			this._URI = Services.io.newURI(this.URIspec, null, null);
				
		return this._URI;
	}
		

	// TODO: implement
	/**
	 * Returns the alternative URI for the icon
	 * 
	 * @param   size   The size of the icon
	 * 
	 * @returns    URI-String
	 */
	getAlternativeIconURIString(size: number) {
		return "";
	}
		
	/**
	 * Sets an alternative URI for the icon
	 * 
	 * @param   URISpec   The URI specification of the icon
	 * @param   size      The size of the icon
	 */
	setAlternativeIconURIString(URISpec: string, size: number) {
		this.alternativeIconURIs[size] = URISpec;
	}

	/**
	 * Checks if the local file is a directory
	 *    - may resolve instantly or trigger an IO request
	 *
	 * @returns   Promise: true if file is directory
	 */
	isDirectory(): Promise.IPromiseBool {
		throw new Error("Not Implemented");
	}

	/**
	 * Checks if the local file is a symlink
	 *    - may resolve instantly or trigger an IO request
	 *
	 * @returns   Promise: true if file is symlink
	 */
	isSymLink(): Promise.IPromiseBool{
		throw new Error("Not Implemented");
	}

	/**
	 * Checks if the local file is a file
	 *    - may resolve instantly or trigger an IO request
	 *
	 * @returns   Promise: true if file is a file
	 */
	isFile(): Promise.IPromiseBool{
		throw new Error("Not Implemented");
	}

	/**
	 * Checks if the local file exists
	 *    - may resolve instantly or trigger an IO request
	 *
	 * @returns   Promise: true if file exists
	 */
	exists(): Promise.IPromiseBool {
		throw new Error("Not Implemented");
	}

	/**
	 * Returns the string representation of the file as a moz-icon URI
	 * 
	 * @param   size   Size of the image
	 * 
	 * @returns    Promise: String representation as moz-icon URI
	 */
	getIconURIString(size): Promise.IPromiseString {
		throw new Error("Not Implemented");
	}

	/**
	 * Returns the display name
	 * 
	 * @returns    Display name
	 */
	getDisplayName(): string {
		 throw new Error("Not Implemented");
	}

	/**
	 * Returns a Group representing the directory entries
	 *    - may trigger IO requests
	 *
	 * @returns   Promise: Group representing the directory contents
	 */
	getDirectoryEntries(options?): MGroup.IPromiseGroup {
		throw new Error("Not Implemented");
	}

	/**
	 * Opens the given file
	 *   - returns URISpec to open for directories, launches files
	 * 
	 * @returns   URISpec for directory to open, empty string for files
	 */
	open(): Promise.IPromiseString {
		throw new Error("Not Implemented");
	}

	/**
	 * Returns the parent item
	 * 
	 * @returns   Parent item
	 */
	get parent(): Item {
		throw new Error("Not Implemented");
	}

}