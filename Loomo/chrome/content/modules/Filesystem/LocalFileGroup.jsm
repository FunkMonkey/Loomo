var EXPORTED_SYMBOLS = ["LocalFileGroup"];

var Ci = Components.interfaces;

Components.utils.import("chrome://fibro/content/modules/Utils/Extension.jsm");
Components.utils.import("chrome://fibro/content/modules/Group.jsm");
Components.utils.import("chrome://fibro/content/modules/Item.jsm");
Components.utils.import("chrome://fibro/content/modules/Filesystem/LocalFile.jsm");

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
function LocalFileGroup(itemOrURIOrSpec, options)
{
	// TODO: move some of this to FileGroup.jsm
	
	this.setOptions(options);
	
	if(itemOrURIOrSpec === undefined)
		throw new Error("Constructor needs at least one parameter that can be a File, nsIFile, nsIURI or a string representing a URI spec!");
	
	if(itemOrURIOrSpec instanceof Item && !(itemOrURIOrSpec instanceof LocalFile))
		throw new Error("Unsupported parameter. The argument passed is an Item, but not a File!");
	
	if(itemOrURIOrSpec instanceof Ci.nsILocalFile)
	{
		Group.call(this, LocalFile.prototype.createFromXPCOMFile(itemOrURIOrSpec));
	}
	else
	{
		Group.call(this, itemOrURIOrSpec); // TODO, we should check for URI or string
	}
	
	this.directory = this.contextItem;
	
	this._loadFiles();
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
		//Cu.import("chrome://fibro/content/scripts/modules/Fibro.jsm");
		
		// TODO: throw exception if it is not a directory
		
		// not working anyway!!!
		/*if(filegroup.directory.file.isSymlink())
		{
			var tmpFile  = new MOZ.LocalFile();
			tmpFile.initWithPath(groupDir.targetPath);
			filegroup.directory.file = tmpFile;
		}*/
		
		// create the filegroup items from the directory entries
		var files = this.directory.file.directoryEntries;
		
		while (files.hasMoreElements())
		{
			var xpcomFile = files.getNext().QueryInterface(Ci.nsIFile);
			if(!this.options.includeHidden && xpcomFile.isHidden())
				continue;
			/*if(((Ci.nsIFileGroupFromDir.ONLY_DIRS & aFlags) == Ci.nsIFileGroupFromDir.ONLY_DIRS) && groupItemFile.isFile())
				continue;*/
			
			var file = new LocalFile(xpcomFile);
			this.push(file);
		}
	},
	
};

Extension.inherit(LocalFileGroup, Group);