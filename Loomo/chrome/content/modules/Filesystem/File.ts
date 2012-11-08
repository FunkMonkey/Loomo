// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================

import LogUtils = module("../Utils/log");

import MItem = module("../Item");

///<reference path='../../MozPromise.d.ts' />
Components.utils.import("resource://gre/modules/commonjs/promise/core.js");


/**
 * Represents a file
 *
 * @property {nsIFIle}  xpcomFile  Underlying nsIFile
 *
 * @constructor
 * @param   {nsIURI|string}   uriOrFile   nsIFIle, URI or URIspec this file represents
 */
export class File extends MItem.Item {

    constructor (uriOrFile) {
        super(-1);

        // added to ignore super as first constructor statement
        if (uriOrFile === -1)
            return null;

        // the param should only be undefined if another Constructor already handles it
        if (uriOrFile === undefined) {
            throw new Error("Constructor needs exactly one parameter that can be a nsIFile, a nsIURI or a string representing a URI spec!");
        } else {
            super(uriOrFile);
        }
    }


    /**
	 * Opens the given file
	 *   - returns URISpec to open for directories, launches files
	 * 
	 * @returns {string}   URISpec for directory to open, empty string for files
	 */
    open(): Promise.IPromiseString {
        // TODO: find a way to provide a working directory for executables
        // TODO: implement launching of unix-files
        // 
        var self = this;

        return this.isDirectory().then(function (res) {
            if (res) {
                return self.URIspec;
            } else {
                throw new Error("File launching not implemented");
            }
        });
    }


    /**
	 * Returns the string representation of the file as a moz-icon URI
	 * 
	 * @param   {number}   size   Size of the image
	 * 
	 * @returns {string}   String representation as moz-icon URI
	 */
    getIconURIString(size): Promise.IPromiseString {
        var alternativeIcon = this.getAlternativeIconURIString(size);
        if (alternativeIcon !== "") {
            return Promise.resolve(alternativeIcon);
        }
        else {

            var self = this;
            var promise = self.exists().then(function successExist(res): any {

                // existing files
                if (res) {
                    var iconURIunique = "moz-icon:" + self.URIspec.substring(1) + "?size=" + size; // TODO: make independent from xfile
                    return self.isDirectory().then(function successDir(res) {

                            // folders can have user-set icons, so grab it from the URI
                            if (res) {
                                return iconURIunique;
                            } else {
                                var ext = self.basename;
                                ext = ext.substring(ext.lastIndexOf(".") + 1);

                                // some file types have user-set icons, so grab it from the URI
                                if (ext === "exe" || ext === "lnk" || ext === "ico") {
                                    return iconURIunique;
                                }

                                // for everything else, grab it from the file extension
                                return "moz-icon://." + ext + "?size=" + size;
                            }
                        }, function (e) {
                            throw e;
                        });

                    // file does not exist
                } else {
                    return "chrome://global/skin/icons/warning-16.png";
                }

            }, function (e) {
                return Promise.resolve("chrome://global/skin/icons/warning-16.png");
            });

            return promise.then(null, function (e) {
                LogUtils.logError(e);
                return Promise.resolve("chrome://global/skin/icons/warning-16.png");
            });
        }
    }

    get basename(): string {
        throw new Error("Not Implemented");
    }

    /**
	 * Returns the display name
	 * 
	 * @returns {string}   Display name
	 */
    getDisplayName(): string {
        if (this.alternativeDisplayName !== "")
            return this.alternativeDisplayName;
        else
            return this.basename;
    }

}


