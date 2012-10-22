var EXPORTED_SYMBOLS = ["Item"];

Components.utils.import("chrome://fibro/content/modules/Utils/Services.jsm");

/**
 * Represents an item (base class for files, etc.)
 *
 * @property {nsIURI}          URI                      URI that the item represents
 * @property {string}          alternativeDisplayName   Alternative name for displaying
 * @property {Object<string>}  alternativeIconURIs      Alternative icons for displaying
 *
 * @constructor
 * @param   {nsIURI|string}   URIorSpec   URI or URIspec this item represents
 */
function Item(URIorSpec)
{
	this.URI = null;
	this.alternativeDisplayName = "";
	this.alternativeIconURIs = {};
	
	if(URIorSpec === undefined)
		throw new Error("Constructor needs exactly one parameter that can be a nsIURI or a string representing a URI spec!");
	
	if(typeof(URIorSpec) === "string")
	{
		this.URI = Services.io.newURI(URIorSpec, null, null);
	}
	else if(URIorSpec instanceof Components.interfaces.nsIURI)
	{
		this.URI = URIorSpec;
	}
	else
	{
		throw new Error("unsupported parameter. Please pass a nsIURI or a string representing a URI spec!");
	}
}


Item.prototype = {
	
		constructor: Item,

		/**
		 * Returns the alternative URI for the icon
		 * 
		 * @param   {number}   size   The size of the icon
		 * 
		 * @returns {string}   URI-String
		 */
		getAlternativeIconURIString: function getAlternativeIconURIString(size)
		{
			return "";
		},
		
		/**
		 * Sets an alternative URI for the icon
		 * 
		 * @param   {string}   URISpec   The URI specification
		 * @param   {number}   size      The size of the icon
		 */
		setAlternativeIconURIString: function setAlternativeIconURIString(/* string */ URISpec, /* number */ size)
		{
			this.alternativeIconURIs[size] = URISpec;
		},
		
		/*
		
			Needed:
				- isOpeningInView
				- open
				- getParentURISpec
				- getDisplayName
				- getIconURIString
		 
		 
		*/
};