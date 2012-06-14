var EXPORTED_SYMBOLS = ["File"];

Components.utils.import("chrome://fibro/content/modules/Utils/log.jsm");
Components.utils.import("chrome://fibro/content/modules/Utils/Extension.jsm");
Components.utils.import("chrome://fibro/content/modules/Item.jsm");

Ci = Components.interfaces;

/**
 * Represents a file
 *
 * @property {nsIFIle}  xpcomFile  Underlying nsIFile
 *
 * @constructor
 * @param   {nsIURI|string}   uriOrFile   nsIFIle, URI or URIspec this file represents
 */
function File(uriOrFile)
{
	this._xpcomFile = null;
	
	if(uriOrFile === undefined)
		throw new Error("Constructor needs exactly one parameter that can be a nsIFile or nsIURI or a string representing a URI spec!");
	
	if(uriOrFile instanceof Ci.nsIFile)
	{
		var URI = this.getURIFromXPCOMFile(uriOrFile); // polymorphic
		Item.call(this, URI);
		this._xpcomFile = uriOrFile;
	}
	else
	{
		Item.call(this, uriOrFile);
		//this.file = this.getXPCOMFileFromURI(this.URI) // polymorphic;
	}
};

File.prototype = {
	
	constructor: File,
	
	get xpcomFile()
	{
		if(!this._xpcomFile)
			this._xpcomFile = this.getXPCOMFileFromURI(this.URI) // polymorphic;
			
		return this._xpcomFile;
	},
	
	set xpcomFile(val)
	{
		this._xpcomFile = val;
	},
	
	// TODO: remove
	/**
	 * Checks if the file will be opened in the fileview
	 * 
	 * @returns {boolean}   true if the file is a directory
	 */
	isOpeningInView: function isOpeningInView()
	{
		// TODO: if not directory, check firefox applications, so it might be shown in firefox
		if(this.xpcomFile.isDirectory())
			return true;
		else
			return false;
	},
	
	/**
	 * Opens the given file
	 *   - returns URISpec to open for directories, launches files
	 * 
	 * @returns {string}   URISpec for directory to open, empty string for files
	 */
	open: function open()
	{
		// TODO: find a way to provide a working directory for executables
		// TODO: implement launching of unix-files
		
		if(this.xpcomFile.isDirectory())
		{
			return this.URI.spec;
		}
		else
		{
			this.xpcomFile.launch();
			return "";
		}
		
	},
	
	
	/**
	 * Returns the string representation of the file as a moz-icon URI
	 * 
	 * @param   {number}   size   Size of the image
	 * 
	 * @returns {string}   String representation as moz-icon URI
	 */
	getIconURIString: function getIconURIString(size)
	{
		var alternativeIcon = this.getAlternativeIconURIString(size);
		if(alternativeIcon !== "")
		{
			return alternativeIcon;
		}
		else
		{
			var iconURIunique = "";
			if(this.xpcomFile.exists())
				iconURIunique = "moz-icon:" + this.URI.spec.substring(1) + "?size=" + size; // TODO: make independent from xfile
			else
				return "chrome://global/skin/icons/warning-16.png"; // TODO check if favicon from Places, before showing warning-picture
			
			// TODO: try to get rid of the exceptions
			try{
				// folders can have user-set icons, so grab it from the URI
				if(this.xpcomFile.isDirectory())
				{
					return iconURIunique;
				}
				else
				{
					var ext = this.xpcomFile.leafName;
					ext = ext.substring(ext.lastIndexOf(".") + 1);
					
					// some file types have user-set icons, so grab it from the URI			
					if(ext === "exe" || ext === "lnk" || ext === "ico")
					{
						return iconURIunique;
					}
					
					// for everything else, grab it from the file extension
					return "moz-icon://." + ext + "?size=" + size;
				}
			}
			catch(e)
			{
				return "chrome://global/skin/icons/warning-16.png";
			}
			
			
		}
	},
	
	/**
	 * Returns the display name
	 * 
	 * @returns {string}   Display name
	 */
	getDisplayName: function getDisplayName()
	{
		if(this.alternativeDisplayName != "")
			return this.alternativeDisplayName;
		else
			return this.xpcomFile.leafName;
	},
	
	/**
	 * Returns the parent file
	 * 
	 * @returns {File}   Parent file
	 */
	get parent()
	{
		var parent = this.xpcomFile.parent;
		if(parent != null)
		{
			return this.createFromXPCOMFile(parent);
		}
		else
			return null;
	},
};

Extension.inherit(File, Item);


