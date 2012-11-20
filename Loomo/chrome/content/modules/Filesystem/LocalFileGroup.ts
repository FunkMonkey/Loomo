// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================



import MGroup = module("../Group");
//import MItem = module("../Item");
import MLocalFile = module("LocalFile");

///<reference path='../../MozOSFile.d.ts' />
Components.utils.import("resource://gre/modules/osfile.jsm");

/**
 * Represents options used for creating the file group
 */
export interface IOptions {
	includeHidden?: bool;
}

///<reference path='../../MozPromise.d.ts' />
export interface IPromiseLocalFileGroup extends MGroup.IPromiseGroup {
	then(onSuccess: (val: LocalFileGroup) => any, onFail?: Function): Promise.IPromise;
}

/**
 * Represents a group of local files
 */
export class LocalFileGroup extends MGroup.Group {

	/**
	 * The directory the contents come from
	 *    - null if not created from single directory
	 */
	directory: MLocalFile.LocalFile;

	/**
	 * Options used for creating the group
	 */
	options: IOptions;

	/**
	 * Represents a group of local files
	 *
	 * @constructor
	 * @param   localFileOrSomething   Anything a LocalFile can be created from
	 * @param   [options]              Options for creating group
	 */
	constructor (localFileOrSomething: string,                       options?: IOptions);
	constructor (localFileOrSomething: MLocalFile.LocalFile,         options?: IOptions);
	constructor (localFileOrSomething: Components.interfaces.nsIURI, options?: IOptions);
	constructor (localFileOrSomething: OS.IDirectoryEntry,           options?: IOptions);
	constructor (localFileOrSomething: any,                          options?: IOptions) {
		super(-1);
		// TODO: move some of this to FileGroup.jsm

		this.setOptions(options);

		if (localFileOrSomething === undefined) {
			throw new Error("Constructor needs at least one parameter that has to be a LocalFile!");
		} else if (localFileOrSomething instanceof MLocalFile.LocalFile) {
			super(localFileOrSomething);
		} else {
			super(new MLocalFile.LocalFile(localFileOrSomething));
		}

		this.directory = < MLocalFile.LocalFile > this.contextItem;
	}

	/**
	 * Creates and loads a LocalFileGroup
	 *
	 * @param   localFile   Anything a LocalFile can be created from
	 * @param   [options]   Options for creating group
	 *
	 * @retuns   Promise: The created LocalFileGroup
	 */
	static create(localFile: string,                       options?: IOptions): IPromiseLocalFileGroup;
	static create(localFile: MLocalFile.LocalFile,         options?: IOptions): IPromiseLocalFileGroup;
	static create(localFile: Components.interfaces.nsIURI, options?: IOptions): IPromiseLocalFileGroup;
	static create(localFile: OS.IDirectoryEntry,           options?: IOptions): IPromiseLocalFileGroup;
	static create(localFile: any,                          options?: IOptions): IPromiseLocalFileGroup {
		var fileGroup = new LocalFileGroup(localFile, options);
		return fileGroup._loadFiles();
	};


	/**
	 * Sets the options
	 *
	 * @param   options   Options to set
	 */
	setOptions(options?: IOptions) {
		this.options = {};
		if(options !== undefined) {
			this.options.includeHidden = (options.includeHidden === undefined || options.includeHidden === true) ? true : false;
		} else {
			this.options.includeHidden = true;
		}
	}
	
	/**
	 * Loads the LocalFileGroup
	 *
	 * @retuns   Promise: The loaded LocalFileGroup
	 */
	_loadFiles(): IPromiseLocalFileGroup {

		var self = this;

		var iterator = new OS.File.DirectoryIterator(this.directory.path);
		var promise = iterator.forEach(function iter(entry, index) {
				self.push(new MLocalFile.LocalFile(entry));
			});

		return promise.then(function onSuccess() {
		   iterator.close();
		   return self;
		}, function onError(e) {
		   iterator.close();
		   throw e; // Propagate error
		});
	}

}

// Making LocalFileGroup known to LocalFile
MLocalFile.setLocalFileGroup(LocalFileGroup);