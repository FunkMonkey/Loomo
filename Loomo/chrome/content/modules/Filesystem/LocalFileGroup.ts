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

export interface IOptions {
    includeHidden?: bool;
}

///<reference path='../../MozPromise.d.ts' />
export interface IPromiseLocalFileGroup extends Promise.IPromise {
    then(onSuccess: (val: LocalFileGroup) => any, onFail?: Function): Promise.IPromise;
}

/**
    * Represents a group of local files
    *
    * @property {LocalFile}  directory   The directory this group was created from
    * @property {Object}     options     Options that have been used for creating the group
    *
    * @constructor
    * @param   {LocalFile|nsIURI|string}   itemOrURIOrSpec   LocalFile, URI or URIspec this group will be created from
    * @param   {Object}                    [options]         Options for creating group
    */
export class LocalFileGroup extends MGroup.Group {

    directory: MLocalFile.LocalFile;
    options: IOptions;

    constructor (localFileOrSomething, options: IOptions) {
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

    static create(localFile, options): IPromiseLocalFileGroup{
	    var fileGroup = new LocalFileGroup(localFile, options);
	    return fileGroup._loadFiles(options);
    };

    setOptions(options: IOptions): void
	{
		this.options = {};
		if(options !== undefined)
		{
			this.options.includeHidden = (options.includeHidden === undefined || options.includeHidden === true) ? true : false;
		}
		else
		{
			this.options.includeHidden = true;
		}
	}
	
	_loadFiles(/* long */ aFlags): IPromiseLocalFileGroup
	{

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

MLocalFile.setLocalFileGroup(LocalFileGroup);