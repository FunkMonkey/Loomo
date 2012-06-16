var EXPORTED_SYMBOLS = ["LocalFile"];

Components.utils.import("chrome://fibro/content/modules/Utils/Extension.jsm");
Components.utils.import("chrome://fibro/content/modules/Filesystem/File.jsm");
Components.utils.import("chrome://fibro/content/modules/Utils/Services.jsm");
Components.utils.import("chrome://fibro/content/modules/ItemRegistry.jsm");

Ci = Components.interfaces;

/**
 * Represents a local file
 *
 * @property {nsIFIle}  xpcomFile  Underlying nsIFile
 *
 * @constructor
 * @param   {nsIURI|string}   uriOrFile   nsIFIle, URI or URIspec this file represents
 */
function LocalFile(uriOrFile)
{
	if(uriOrFile === undefined)
		throw new Error("Constructor needs exactly one parameter that can be a nsILocalFile or nsIURI or a string representing a URI spec!");
	
	if(uriOrFile instanceof Ci.nsIFile && !(uriOrFile instanceof Ci.nsILocalFile))
		throw new Error("Unsupported parameter. The argument passed is a nsIFile, but not a nsILocalFile!");	
	
	File.call(this, uriOrFile);
};

LocalFile.prototype = {

	constructor: LocalFile,
	
	/**
	 * Creates a local file from the given XPCOM file
	 * 
	 * @param   {nsIFile}   file   The file
	 * 
	 * @returns {LocalFile}   Created local file
	 */
	createFromXPCOMFile: function getURISpecFromXPCOMFile(file)
	{
		return new LocalFile(file);
	},

	/**
	 * Returns the "xfile" URI spec given by a nsIFile
	 * 
	 * @param   {nsIFile}   file   The file
	 * 
	 * @returns {string}   URI spec
	 */
	getURISpecFromXPCOMFile: function getURISpecFromXPCOMFile(file)
	{
		var tmpFileURI = Services.io.newFileURI(file);
		return "x" + tmpFileURI.spec;
	},
	
	/**
	 * Returns the "xfile" URI given by a nsIFile
	 * 
	 * @param   {nsIFile}   file   The file
	 * 
	 * @returns {nsIURI}   URI
	 */
	getURIFromXPCOMFile: function getURIFromXPCOMFile(file)
	{
		var tmpSpec = LocalFile.prototype.getURISpecFromXPCOMFile(file);
		
		return Services.XFileProtocolHandler.newURI(tmpSpec, null, null);
	},
	
	/**
	 * Returns the nsILocalFile object given by a "xfile" URI
	 * 
	 * @param   {nsIURI}   URI   The URI to the file; scheme MUST be "xfile"
	 * 
	 * @returns {nsILocalFile}   File object
	 */
	getXPCOMFileFromURI: function getXPCOMFileFromURI(URI)
	{		
		return LocalFile.prototype.getXPCOMFileFromURISpec(URI.spec);
	},
	
	/**
	 * Returns the nsILocalFile object given by a "xfile" URI spec
	 * 
	 * @param   {string}   URISpec   The URI to the file; scheme MUST be "xfile"
	 * 
	 * @returns {nsILocalFile}   File object
	 */
	getXPCOMFileFromURISpec: function getXPCOMFileFromURISpec(URISpec)
	{
		// remove the "x" from the spec to get a "file:" URI
		var tmpURI_spec = URISpec.substring(1);
		
		// create the "file:" URI and return the file
		var fileURI = Services.FileProtocolHandler.newURI(tmpURI_spec, null, null);
		return fileURI.QueryInterface(Ci.nsIFileURL).file;
	},

};

Extension.inherit(LocalFile, File);

ItemRegistry.registerItemConstructor("xfile", LocalFile);