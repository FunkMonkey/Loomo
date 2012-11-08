// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================

///<reference path='../MozPromise.d.ts' />
Components.utils.import("resource://gre/modules/commonjs/promise/core.js");


import MGroup = module("Group");
export interface IPromiseGroup extends Promise.IPromise {
    then(onSuccess: (val: MGroup.Group) => any, onFail?: Function): Promise.IPromise;
}

/**
 * Represents a container for views
 */
export class Item {

    URIspec: string;
    _URI: Components.interfaces.nsIURI;

    alternativeDisplayName: string;

    // TODO: use interface
    alternativeIconURIs: any;

    /**
     * Represents a container for views
     *
     * @constructor
     * @param   {element}   node   The connected DOM element
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
	    } else if(typeof(URIorSpec) === "string") {
		    this.URIspec = URIorSpec;
	    } else if(URIorSpec instanceof Components.interfaces.nsIURI) {
		    this._URI = URIorSpec;
		    this.URIspec = this._URI.spec;
	    } else {
		    throw new Error("unsupported parameter. Please pass a nsIURI or a string representing a URI spec!");
	    }
    }

    get URI()
	{
		if(!this._URI)
			this._URI = Services.io.newURI(this.URIspec, null, null);
				
		return this._URI;
	}
		

	/**
		* Returns the alternative URI for the icon
		* 
		* @param   {number}   size   The size of the icon
		* 
		* @returns {string}   URI-String
		*/
	getAlternativeIconURIString(size: number)
	{
		return "";
	}
		
	/**
		* Sets an alternative URI for the icon
		* 
		* @param   {string}   URISpec   The URI specification
		* @param   {number}   size      The size of the icon
		*/
	setAlternativeIconURIString(URISpec: string, size: number)
	{
		this.alternativeIconURIs[size] = URISpec;
	}

        isDirectory(): Promise.IPromiseBool {
        throw new Error("Not Implemented");
    }

    exists(): Promise.IPromiseBool {
        throw new Error("Not Implemented");
    }

    getIconURIString(size): Promise.IPromiseString {
        throw new Error("Not Implemented");
    }

    getDisplayName(): string {
         throw new Error("Not Implemented");
    }

    getDirectoryEntries(options?): IPromiseGroup {
		throw new Error("Not Implemented");
	}

    /**
	 * Opens the given file
	 *   - returns URISpec to open for directories, launches files
	 * 
	 * @returns {string}   URISpec for directory to open, empty string for files
	 */
    open(): Promise.IPromiseString {
        throw new Error("Not Implemented");
    }

    get parent(): Item {
        throw new Error("Not Implemented");
    }

}