var EXPORTED_SYMBOLS = ["SimpleList"];

Components.utils.import("chrome://fibro/content/modules/Utils/Extension.jsm");
Components.utils.import("chrome://fibro/content/modules/Utils/XBLUtils.jsm");
Components.utils.import("chrome://fibro/content/bindings/itemview/ListBase.jsm");

/**
 * A simple list view
 *
 * @constructor
 */
SimpleList = function SimpleList()
{
	XBLUtils.inherit(this, SimpleList);
	ListBase.call(this);
};

// TODO: document
SimpleList.prototype = {
	
	constructor: SimpleList,
	

	_appendItem: function _appendItem(item, list)
	{
		var cell = this.ownerDocument.createElement("simple_list_item");
		list.appendChild(cell);
		this.items.push(cell);
		
		cell.setItem(item);
		
		return cell; 
	},
	

	_loadItems: function _loadItems()
	{
		Components.utils.import("chrome://fibro/content/modules/utils/log.jsm");
		
		// AccessCount
		
		//var list = this.ownerDocument.getAnonymousNodes(this)[0].childNodes[0];
		var list = XBLUtils.getAnonNode(this, "column");
		
		// TODO: clear the list at the beginning or something like that
		for(var i = 0, len = this.itemGroup.length; i < len; ++i)
		{
			this._appendItem(this.itemGroup[i], list);
		}
	},
	

	_selectDOMItemRange: function _selectDOMItemRange(startDOMItem, endDOMItem)
	{
		if(!startDOMItem && !endDOMItem)
			this.clearSelection();
			
			// Don't forget visibility!!!
	},
	
};

Extension.inherit(SimpleList, ListBase);
