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
 * @param   {element}   node   The connected DOM element
 */
ListItemBase = function ListItemBase(node)
{
	this.node = node;
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
		var parent = this.node.parentNode;
		while (parent)
		{
			if (parent.impl && parent.impl instanceof ListBase)
			{
				this._list = parent.impl;
				return this._list;
			}
			parent = parent.parentNode;
		}
		
		return null;
	},

	get isSelected()
	{
		return this.node.hasAttribute("isSelected");
	},
	
	get _isSelected()
	{
		return this.node.hasAttribute("isSelected");
	},
	
	set _isSelected(value)
	{
		if (value)
			this.node.setAttribute("isSelected", "");
		else
			this.node.removeAttribute("isSelected");
	},
	
};

