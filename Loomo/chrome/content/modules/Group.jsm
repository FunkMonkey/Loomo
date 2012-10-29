var EXPORTED_SYMBOLS = ["Group"];

Components.utils.import("chrome://fibro/content/modules/Utils/Extension.jsm");
Components.utils.import("chrome://fibro/content/modules/Item.jsm");


/**
 * Represents a group of items
 *
 * @property {Item}   contextItem   Creation context of this group
 *
 * @constructor
 * @param   {Item|nsIURI|string}   itemOrURIOrSpec   Item, URI or URIspec that will be set as the contextItem
 */
function Group(itemOrURIOrSpec)
{
	this.contextItem = null;
	
	if(itemOrURIOrSpec === undefined)
		throw new Error("Constructor needs exactly one parameter that can be an Item or nsIURI or a string representing a URI spec!");
	
	if(itemOrURIOrSpec instanceof Item)
	{
		this.contextItem = itemOrURIOrSpec;
	}
	/*else if(itemOrURIOrSpec instanceof Components.interfaces.nsIURI)
	{
		// TODO: use Fibro item registry
		Cu.import("chrome://fibro/content/scripts/modules/Fibro.jsm");
		this.contextItem = Fibro.createItemFromURI(itemOrURIOrSpec);	
	}
	else if(typeof(itemOrURIOrSpec) === "string")
	{
		// TODO: use Fibro item registry
		Cu.import("chrome://fibro/content/scripts/modules/Fibro.jsm");
		this.contextItem = Fibro.createItemFromURISpec(itemOrURIOrSpec);	
	}*/
	else
		throw new Error("Unsupported parameter. Please pass an Item or nsIURI or a string representing a URI spec!");
	
}

Group.prototype = {
	constructor: Group
};

Extension.inherit(Group, Array);