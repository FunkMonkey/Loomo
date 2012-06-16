var EXPORTED_SYMBOLS = ["SimpleList"];

Components.utils.import("chrome://fibro/content/modules/Utils/Extension.jsm");
Components.utils.import("chrome://fibro/content/modules/Utils/XBLUtils.jsm");
Components.utils.import("chrome://fibro/content/bindings/itemview/ListBase.jsm");

/**
 * A simple list view
 *
 * @constructor
 * @param   {element}   node   The connected DOM element
 */
SimpleList = function SimpleList(node)
{
	ListBase.call(this, node);
};

// TODO: document
SimpleList.prototype = {
	
	constructor: SimpleList,
	

	_appendItem: function _appendItem(item, list)
	{
		var cell = this.node.ownerDocument.createElement("simple_list_item");
		list.appendChild(cell);
		this.items.push(cell);
		
		cell.impl.setItem(item);
		
		return cell; 
	},
	

	_loadItems: function _loadItems()
	{
		// AccessCount
		
		//var list = this.ownerDocument.getAnonymousNodes(this)[0].childNodes[0];
		var list = XBLUtils.getAnonNode(this.node, "column");
		
		// TODO: clear the list at the beginning or something like that
		for(var i = 0, len = this.itemGroup.length; i < len; ++i)
		{
			this._appendItem(this.itemGroup[i], list);
		}
	},
	

	_selectListItemRange: function _selectListItemRange(startListItem, endListItem)
	{
		if(!startListItem && !endListItem)
			this.clearSelection();
			
			// Don't forget visibility!!!
	},
	
};

Extension.inherit(SimpleList, ListBase);
