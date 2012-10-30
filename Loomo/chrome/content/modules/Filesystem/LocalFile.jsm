var EXPORTED_SYMBOLS = ["LocalFile", "setLocalFileGroup"];

Components.utils.import("chrome://fibro/content/modules/Utils/log.jsm");
Components.utils.import("chrome://fibro/content/modules/Utils/Extension.jsm");
Components.utils.import("chrome://fibro/content/modules/Filesystem/File.jsm");
Components.utils.import("chrome://fibro/content/modules/Utils/Services.jsm");
Components.utils.import("chrome://fibro/content/modules/ItemRegistry.jsm");


Components.utils.import("resource://gre/modules/osfile.jsm");
Components.utils.import("resource://gre/modules/commonjs/promise/core.js");

Ci = Components.interfaces;

var separator = (OS.Win) ? "\\" : "/";


var LocalFileGroup = null;
function setLocalFileGroup(lfg){LocalFileGroup = lfg; }

/**
 * Represents a local file
 *
 * @property {nsIFIle}  xpcomFile  Underlying nsIFile
 *
 * @constructor
 * @param   {nsIURI|string}   uriOrFile   nsIFIle, URI or URIspec this file represents
 */
function LocalFile(pathURIFile)
{
	this.path = "";
	this._nsIFile = null;
	this.info = null;
	this.directoryEntry = null;

	if(pathURIFile === undefined) {
		throw new Error("Constructor needs exactly one parameter that can be a nsIFile, or nsIURI, a string representing a URI spec or native path!");
	} else if(typeof pathURIFile === "string") {

		if(pathURIFile.startsWith("xfile://")){
			File.call(this, pathURIFile);
			this.path = LocalFile.xfileURLToPath(this.URIspec);
		} else if(pathURIFile.startsWith("file://")){
			File.call(this, "x" + pathURIFile);
			this.path = LocalFile.xfileURLToPath(this.URIspec);
		} else {
			this.path = pathURIFile;
			var URIspec = LocalFile.pathToXFileURL(pathURIFile);
			File.call(this, URIspec);
		}

	// TODO: use the constructor, when bug was fixed
	} else if(pathURIFile.name && pathURIFile.path/*pathURIFile instanceof OS.File.DirectoryIterator.Entry*/) {
		this.directoryEntry = pathURIFile;
		this.path = this.directoryEntry.path;
		var URIspec2 = LocalFile.pathToXFileURL(this.path);
		File.call(this, URIspec2);
	} else {
		File.call(this, pathURIFile);
		this.path = LocalFile.xfileURLToPath(this.URIspec);
	}

	

}

LocalFile.pathToXFileURL = function pathToXFileURL(path){
	if(OS.Constants.Win)
		return "xfile:///" + OS.Path.normalize(path).replace(/\\/g, "/");
	else
		return "xfile://" + OS.Path.normalize(path);
};

LocalFile.xfileURLToPath = function xfileURLToPath(urlSpec){
	if(OS.Constants.Win) {
		return urlSpec.substr(9).replace(/\//g, "\\");
	} else {
		return urlSpec.substr(8);
	}
};

LocalFile.prototype = {

	constructor: LocalFile,

	getNsIFile: function getNsIFile(){
		// TODO: implement
		throw new Error("Not Implemented");
	},

	get basename() {
		return OS.Path.basename(this.path);
	},

	/**
	 * Returns the parent file
	 * 
	 * @returns {File}   Parent file
	 */
	get parent()
	{
		var dirname = OS.Path.dirname(this.path);
		if(dirname !== ".")
		{
			return new LocalFile(dirname);
		}
		else
			return null;
	},

	exists: function exists(){
		if(this.info || this.directoryEntry) {
			return Promise.resolve(true);
		} else if(this.infoError) {
			return Promise.reject(this.infoError);
		} else {
			// TODO: use OS.File.exists
			var deferred = Promise.defer();
			this.updateInfo().then(function(res){
					deferred.resolve(true);
				}, function(e){
					if(e.becauseNoSuchFile)
						deferred.resolve(false);
					else
						throw e;
				});
			return deferred.promise;
		}
	},

	updateInfo: function updateInfo(){
		var self = this;
		return OS.File.stat(this.path).then(function(res){
			self.info = res;
			return res;
		}, function(e){
			self.infoError = e;
			throw e;
		});
	},

	isDirectory: function isDirectory(){
		if(this.directoryEntry) {
			return Promise.resolve(this.directoryEntry.isDir);
		} else if(this.info) {
			return Promise.resolve(this.info.isDir);
		} else {
			this.updateInfo().then(function(res){
				return res.isDir;
			});
		}
	},

	isSymLink: function isSymLink(){
		if(this.directoryEntry) {
			return Promise.resolve(this.directoryEntry.isSymLink);
		} else if(this.info) {
			return Promise.resolve(this.info.isSymLink);
		} else {
			this.updateInfo().then(function(res){
				return res.isSymLink;
			});
		}
	},

	isFile: function isFile(){
		if(this.directoryEntry) {
			return Promise.resolve(!this.directoryEntry.isDir &&this.directoryEntry.isSymLink);
		} else if(this.info) {
			return Promise.resolve(!this.info.isDir && !this.info.isSymLink);
		} else {
			return this.updateInfo().then(function(res){
				return (!res.isDir && !res.isSymLink);
			});
		}
	},

	getDirectoryEntries: function getDirectoryEntries(options){
		return LocalFileGroup.create(this, options);
	},
	
	// TODO: move to XPCOMFile
	// /**
	//  * Creates a local file from the given XPCOM file
	//  * 
	//  * @param   {nsIFile}   file   The file
	//  * 
	//  * @returns {LocalFile}   Created local file
	//  */
	// createFromXPCOMFile: function getURISpecFromXPCOMFile(file)
	// {
	// 	return new LocalFile(file);
	// },

	// /**
	//  * Returns the "xfile" URI spec given by a nsIFile
	//  * 
	//  * @param   {nsIFile}   file   The file
	//  * 
	//  * @returns {string}   URI spec
	//  */
	// getURISpecFromXPCOMFile: function getURISpecFromXPCOMFile(file)
	// {
	// 	var tmpFileURI = Services.io.newFileURI(file);
	// 	return "x" + tmpFileURI.spec;
	// },
	
	// /**
	//  * Returns the "xfile" URI given by a nsIFile
	//  * 
	//  * @param   {nsIFile}   file   The file
	//  * 
	//  * @returns {nsIURI}   URI
	//  */
	// getURIFromXPCOMFile: function getURIFromXPCOMFile(file)
	// {
	// 	var tmpSpec = LocalFile.prototype.getURISpecFromXPCOMFile(file);
		
	// 	return Services.XFileProtocolHandler.newURI(tmpSpec, null, null);
	// },
	
	// /**
	//  * Returns the nsILocalFile object given by a "xfile" URI
	//  * 
	//  * @param   {nsIURI}   URI   The URI to the file; scheme MUST be "xfile"
	//  * 
	//  * @returns {nsILocalFile}   File object
	//  */
	// getXPCOMFileFromURI: function getXPCOMFileFromURI(URI)
	// {		
	// 	return LocalFile.prototype.getXPCOMFileFromURISpec(URI.spec);
	// },
	
	// /**
	//  * Returns the nsILocalFile object given by a "xfile" URI spec
	//  * 
	//  * @param   {string}   URISpec   The URI to the file; scheme MUST be "xfile"
	//  * 
	//  * @returns {nsILocalFile}   File object
	//  */
	// getXPCOMFileFromURISpec: function getXPCOMFileFromURISpec(URISpec)
	// {
	// 	// remove the "x" from the spec to get a "file:" URI
	// 	var tmpURI_spec = URISpec.substring(1);
		
	// 	// create the "file:" URI and return the file
	// 	var fileURI = Services.FileProtocolHandler.newURI(tmpURI_spec, null, null);
	// 	return fileURI.QueryInterface(Ci.nsIFileURL).file;
	// },

};

Extension.inherit(LocalFile, File);

ItemRegistry.registerItemConstructor("xfile", LocalFile);