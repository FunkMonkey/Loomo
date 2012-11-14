// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================

import MFile = module("File");
import ItemRegistry = module("../ItemRegistry");

///<reference path='../../MozOSFile.d.ts' />
Components.utils.import("resource://gre/modules/osfile.jsm");

///<reference path='../../MozPromise.d.ts' />
Components.utils.import("resource://gre/modules/commonjs/promise/core.js");

var separator = (OS.Constants.Win) ? "\\" : "/";

import MLocalFileGroup = module("LocalFileGroup");
var LocalFileGroup = null;
export function setLocalFileGroup(lfg){LocalFileGroup = lfg; }

/**
 * Represents a local file
 */
export class LocalFile extends MFile.File {

	/**
	 * Native path of the local file
	 */
    path: string;

    /**
     * XPCOM file
     */
    _nsIFile: Components.interfaces.nsIFile;

    // TODO: refactor to _info
    /**
     * Native file information (stats)
     */
    info: OS.IInfo;

    // TODO: refactor to _infoError
    /**
     * Error object thrown when file stats could not be retrieved
     */
    infoError: any;

    // TODO: refactor to _directoryEntry
    /**
     * Directory entry (when retrieved from iterator)
     */
    directoryEntry: OS.IDirectoryEntry;

    // TODO: add constructor that takes LocalFile
    // TODO: add constructor that takes nsIFile
    /**
     * Represents a local file
     *
     * @constructor
     * @param     uriOrFile   URI or URIspec that represents file or xfile, OS.File.DirectoryIterator.Entry
     */
    constructor(uriOrFile: string);
    constructor(uriOrFile: Components.interfaces.nsIURI);
    constructor(uriOrFile: OS.IDirectoryEntry);
    constructor (pathURIFile: any) {
        super(-1);

        this.path = "";
        this._nsIFile = null;
        this.info = null;
        this.directoryEntry = null;

        if (pathURIFile === undefined) {
            throw new Error("Constructor needs exactly one parameter that can be a nsIFile, or nsIURI, a string representing a URI spec or native path!");
        } else if (typeof pathURIFile === "string") {

            if (pathURIFile.startsWith("xfile://")) {
                super(pathURIFile);
                this.path = LocalFile.xfileURLToPath(this.URIspec);
            } else if (pathURIFile.startsWith("file://")) {
                super("x" + pathURIFile);
                this.path = LocalFile.xfileURLToPath("x" + this.URIspec);
            } else {
                this.path = pathURIFile;
                var URIspec = LocalFile.pathToXFileURL(pathURIFile);
                super(URIspec);
            }

            // TODO: use the constructor, when bug was fixed
        } else if (pathURIFile.name && pathURIFile.path/*pathURIFile instanceof OS.File.DirectoryIterator.Entry*/) {
            this.directoryEntry = pathURIFile;
            this.path = this.directoryEntry.path;
            var URIspec2 = LocalFile.pathToXFileURL(this.path);
            super(URIspec2);
        } else {
            super(pathURIFile);
            this.path = LocalFile.xfileURLToPath(this.URIspec);
        }

    }
    
    /**
     * Converts a given native path to a xfile URL
     *
     * @param   path   Path to convert
     *
     * @returns   According xfile URL
     */
    static pathToXFileURL(path: string): string {
        if (OS.Constants.Win)
            return "xfile:///" + OS.Path.normalize(path).replace(/\\/g, "/");
        else
            return "xfile://" + OS.Path.normalize(path);
    };

    /**
     * Converts a given xfile URL spec to a native path
     *
     * @param   urlSpec   URL spec to convert
     *
     * @returns   According native path
     */
    static xfileURLToPath(urlSpec:string): string {
        if (OS.Constants.Win) {
            return urlSpec.substr(9).replace(/\//g, "\\");
        } else {
            return urlSpec.substr(8);
        }
    };

    /**
     * Returns the XPCOM file for this LocalFile
     *
     * @returns XPCOM file for LocalFile
     */
    getNsIFile(): Components.interfaces.nsIFile {
		// TODO: implement
		throw new Error("Not Implemented");
	}

	/**
     * Returns base name / leafname / last part of the File
     */
	get basename(): string {
		return OS.Path.basename(this.path);
	}

	/**
	 * Returns the parent file
	 * 
	 * @returns   Parent file
	 */
	get parent(): LocalFile {
		var dirname = OS.Path.dirname(this.path);
		if(dirname !== ".")
		{
			return new LocalFile(dirname);
		}
		else
			return null;
	}

	/**
	 * Checks if the local file exists
	 *    - may resolve instantly or trigger an IO request
	 *
	 * @returns   Promise: true if file exists
	 */
	exists() : Promise.IPromiseBool {
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
	}

	/**
	 * Updates the file stats
	 *    - triggers IO request
	 *
	 * @returns   Promise: file stats
	 */
	updateInfo(): OS.IPromiseInfo {
		var self = this;
		return OS.File.stat(this.path).then(function(res){
			self.info = res;
			return res;
		}, function(e){
			self.infoError = e;
			throw e;
		});
	}

	/**
	 * Checks if the local file is a directory
	 *    - may resolve instantly or trigger an IO request
	 *
	 * @returns   Promise: true if file is directory
	 */
	isDirectory(): Promise.IPromiseBool{
		if(this.directoryEntry) {
			return Promise.resolve(this.directoryEntry.isDir);
		} else if(this.info) {
			return Promise.resolve(this.info.isDir);
		} else {
			this.updateInfo().then(function(res){
				return res.isDir;
			});
		}
	}

	/**
	 * Checks if the local file is a symlink
	 *    - may resolve instantly or trigger an IO request
	 *
	 * @returns   Promise: true if file is symlink
	 */
	isSymLink(): Promise.IPromiseBool{
		if(this.directoryEntry) {
			return Promise.resolve(this.directoryEntry.isSymLink);
		} else if(this.info) {
			return Promise.resolve(this.info.isSymLink);
		} else {
			this.updateInfo().then(function(res){
				return res.isSymLink;
			});
		}
	}

	/**
	 * Checks if the local file is a file
	 *    - may resolve instantly or trigger an IO request
	 *
	 * @returns   Promise: true if file is a file
	 */
	isFile(): Promise.IPromiseBool{
		if(this.directoryEntry) {
			return Promise.resolve(!this.directoryEntry.isDir &&this.directoryEntry.isSymLink);
		} else if(this.info) {
			return Promise.resolve(!this.info.isDir && !this.info.isSymLink);
		} else {
			return this.updateInfo().then(function(res){
				return (!res.isDir && !res.isSymLink);
			});
		}
	}

	/**
	 * Returns a LocalFileGroup representing the directory entries
	 *    - triggers IO requests
	 *
	 * @returns   Promise: LocalFileGroup representing the directory contents
	 */
	getDirectoryEntries(options?): MLocalFileGroup.IPromiseLocalFileGroup {
		return LocalFileGroup.create(this, options);
	}
	
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

}

// registering LocalFile to be used for xfile URLs
ItemRegistry.registerItemConstructor("xfile", LocalFile);