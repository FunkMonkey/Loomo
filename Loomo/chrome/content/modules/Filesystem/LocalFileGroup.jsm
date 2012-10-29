var EXPORTED_SYMBOLS = ["LocalFileGroup"];

var Ci = Components.interfaces;

Components.utils.import("chrome://fibro/content/modules/Utils/log.jsm");
Components.utils.import("chrome://fibro/content/modules/Utils/Extension.jsm");
Components.utils.import("chrome://fibro/content/modules/Group.jsm");
Components.utils.import("chrome://fibro/content/modules/Item.jsm");
Components.utils.import("chrome://fibro/content/modules/Filesystem/LocalFile.jsm");
Components.utils.import("resource://gre/modules/osfile.jsm");

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
function LocalFileGroup(localFileOrSomething, options)
{
	// TODO: move some of this to FileGroup.jsm
	
	this.setOptions(options);
	
	if(localFileOrSomething === undefined) {
		throw new Error("Constructor needs at least one parameter that has to be a LocalFile!");
	} else if (localFileOrSomething instanceof LocalFile) {
		Group.call(this, localFileOrSomething);
	} else {
		Group.call(this, new LocalFile(localFileOrSomething));
	}

	this.directory = this.contextItem;
}

LocalFileGroup.create = function create(localFile, options){
	var fileGroup = new LocalFileGroup(localFile, options);
	return fileGroup._loadFiles(options);
};

LocalFileGroup.prototype = {
	
	constructor: LocalFileGroup,
	
	setOptions: function setOptions(options)
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
	},
	
	_loadFiles: function _loadFiles(/* long */ aFlags)
	{

		var self = this;

		var iterator = new OS.File.DirectoryIterator(this.directory.path);
		var promise = iterator.forEach(function iter(entry, index) {
				self.push(new LocalFile(entry));
			});

		return promise.then(function onSuccess() {
		   iterator.close();
		   return self;
		}, function onError(e) {
		   iterator.close();
		   log(e.constructor.name);
		   throw e; // Propagate error
		});
	},
	
};

Extension.inherit(LocalFileGroup, Group);

setLocalFileGroup(LocalFileGroup);