var EXPORTED_SYMBOLS = ["ListItemBase"];

Components.utils.import("chrome://fibro/content/modules/Utils/XBLUtils.jsm");

var ListBase = null;


/**
 * Base for list view items
 *
 * @property {Item}       item    Item this list item is connected to
 * @property {ListBase}   list    List this node belongs to
 *
 * @constructor
 */
ListItemBase = function ListItemBase()
{
	this.item = null;
	this._list = null;
};

ListItemBase.setupModule = function setupModule(listBase){ ListBase = listBase; };

ListItemBase.prototype = {
	
	constructor: ListItemBase,
	
	get list()
	{
		// if we already found our control, then return it (save some performance)
		if(this._list)
			return this._list;
		
		// otherwise look for the control
		var parent = this.parentNode;
		while (parent)
		{
			if (parent instanceof ListBase)
			{
				this._list = parent;
				return this._list;
			}
			parent = parent.parentNode;
		}
		
		return null;
	},

	get isSelected()
	{
		return this.hasAttribute("isSelected");
	},
	
	get _isSelected()
	{
		return this.hasAttribute("isSelected");
	},
	
	set _isSelected(value)
	{
		if (value)
			this.setAttribute("isSelected", "");
		else
			this.removeAttribute("isSelected");
	},
	
};

