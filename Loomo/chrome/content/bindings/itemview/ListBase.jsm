var EXPORTED_SYMBOLS = ["ListBase"];

Components.utils.import("chrome://fibro/content/modules/Utils/XBLUtils.jsm");
Components.utils.import("chrome://fibro/content/bindings/itemview/ListItemBase.jsm");
Components.utils.import("chrome://fibro/content/modules/Item.jsm");

/**
 * Base for list views
 *
 * @property {Group}           itemGroup       Group the view is connected to
 * @property {ListItemBase[]}  items           Items of the view
 * @property {ListItemBase[]}  selectedItems   Selected items
 * @property {Function}        openURICallback Called when item is opened
 *
 * @constructor
 */
ListBase = function ListBase()
{
	this.itemGroup = null;
	this.items = [];
	this.selectedItems = [];
	this.openURICallback = null;
};

ListBase.prototype = {
	
	constructor: ListBase,
	
	/**
	 * Loads the view from the given group
	 * 
	 * @param   {Group}   group   Group to load from
	 */
	loadFromItemGroup: function loadFromItemGroup(group)
	{
		this.itemGroup = group;
		this._loadItems();
	},
	
	
	/**
	 * Adds the given item to the selection
	 * 
	 * @param   {ListItemBase|Item|nsIURI|string}   item   Item to add
	 */
	addItemToSelection: function addItemToSelection(item)
	{
		domItem = this.getDOMItem(item);
		if(!domItem)
			throw new Error("Passed item does not belong to this view or maybe even unsupported argument (take care when passing URI's as strings)");
		
		this.addDOMItemToSelection(domItem);
	},
	
	/**
	 * Adds the given item to the selection
	 * 
	 * @param   {ListItemBase}   domItem   Item to add
	 */
	addDOMItemToSelection: function _addDOMItemToSelection(domItem)
	{
		if(!domItem.isSelected)
		{
			domItem._isSelected = true;
			this.selectedItems.push(domItem);
		}
		else
			throw new Error("Tried to add already selected item to selection");
	},
	
	/**
	 * Removes the given item from the selection
	 * 
	 * @param   {ListItemBase|Item|nsIURI|string}   item   Item to remove
	 */
	removeItemFromSelection: function removeItemFromSelection(item)
	{
		domItem = this.getDOMItem(item);
		if(!domItem)
			throw new Error("Passed item does not belong to this view or maybe even unsupported argument (take care when passing URI's as strings)");
		
		this.removeDOMItemFromSelection(domItem);
	},
	
	/**
	 * Removes the given item from the selection
	 * 
	 * @param   {ListItemBase}   domItem   Item to remove
	 */
	removeDOMItemFromSelection: function removeDOMItemFromSelection(domItem)
	{
		if(domItem.isSelected)
		{
			for (var i = 0; i < this.selectedItems.length; ++i)
			{
				if(this.selectedItems[i] == domItem)
				{
					this.selectedItems.splice(i, 1);
					domItem._isSelected = false;
					return;
				}
			}
			
			// shouldn't reach this
			throw new Error("Given item was not in selection! Well, this shouldn't have happened!");
		}
		else
			throw new Error("Tried to remove unselected item from selection");
	},
	
	/**
	 * Toggles the selection of the given item
	 * 
	 * @param   {ListItemBase|Item|nsIURI|string}   item   Item to toggle selection
	 */
	toggleItemSelection: function toggleItemSelection(item)
	{
		domItem = this.getDOMItem(item);
		if(!domItem)
			throw new Error("Passed item does not belong to this view or maybe even unsupported argument (take care when passing URI's as strings)");
		
		this.toggleDOMItemSelection(domItem);
	},
	
	/**
	 * Toggles the selection of the given item
	 * 
	 * @param   {ListItemBase}   item   Item to toggle selection
	 */
	toggleDOMItemSelection: function _toggleDOMItemSelection(domItem)
	{
		if(domItem.isSelected)
			this.removeDOMItemFromSelection(domItem);
		else
			this.addDOMItemToSelection(domItem);
	},
	
	/**
	 * Clears the selection
	 */
	clearSelection: function clearSelection()
	{
		for(var i = 0, len = this.selectedItems.length; i < len; ++i)
			this.selectedItems[i]._isSelected = false;

		this.selectedItems.length = 0;
	},
	
	/**
	 * Returns the according ListItemBase node for the given input in the given array
	 * 
	 * @param   {ListItemBase|Item|nsIURI|string}   itemOrURIorSpecIn   Input to search for
	 * @param   {Array}                             array               Array to search in
	 * 
	 * @returns {ListItemBase}   Found node or null
	 */
	getDOMItemIn: function getDOMItemIn(itemOrURIorSpecIn, array)
	{
		if(itemOrURIorSpecIn instanceof ListItemBase)
		{
			for(var i = 0, len = array.length; i < len; ++i)
			{
				var domItem = array[i];
				if(domItem === itemOrURIorSpecIn || domItem.item === itemOrURIorSpecIn.item || domItem.item.URI.spec === itemOrURIorSpecIn.item.URI.spec)
					return domItem;
			}
		}
		else if(itemOrURIorSpecIn instanceof Item)
		{
			for(var i = 0, len = array.length; i < len; ++i)
			{
				var domItem = array[i];
				if(domItem.item === itemOrURIorSpecIn || domItem.item.URI.spec === itemOrURIorSpecIn.URI.spec)
					return domItem;
			}
		}
		else if(itemOrURIorSpecIn instanceof Components.interfaces.nsIURI)
		{
			for(var i = 0, len = array.length; i < len; ++i)
			{
				var domItem = array[i];
				if(domItem.item.URI.spec === itemOrURIorSpecIn.spec)
					return domItem;
			}
		}
		else if(typeof(itemOrURIorSpecIn) === "string")
		{
			for(var i = 0, len = array.length; i < len; ++i)
			{
				var domItem = array[i];
				if(domItem.item.URI.spec === itemOrURIorSpecIn)
					return domItem;
			}
		}
			
		return null;
	},
	
	/**
	 * Returns the according ListItemBase node for the given input
	 *    - searches in the items of the list
	 * 
	 * @param   {ListItemBase|Item|nsIURI|string}   itemOrURIorSpecIn   Input to search for
	 * 
	 * @returns {ListItemBase}   Found node or null
	 */
	getDOMItem: function getDOMItem(itemOrURIorSpecIn)
	{
		return this.getDOMItemIn(itemOrURIorSpecIn, this.items);
	},
	
	/**
	 * Returns the according ListItemBase node for the given input in the selected items
	 * 
	 * @param   {ListItemBase|Item|nsIURI|string}   itemOrURIorSpecIn   Input to search for
	 * 
	 * @returns {ListItemBase}   Found node or null
	 */
	getDOMItemInSelection: function getDOMItemInSelection(itemOrURIorSpecIn)
	{
		return this.getDOMItemIn(itemOrURIorSpecIn, this.selectedItems);
	},
	
	/**
	 * Opens the given item with the given event
	 * 
	 * @param   {ListItemBase}   item    Item to open
	 * @param   {event}          event   Event
	 */
	openDOMItem: function openDOMItem(item, event)
	{
		var urispec = item.item.open();
		if(urispec)
			this.openURICallback(urispec, event);
	}, 
	
	/**
	 * Opens the parent of the group
	 * 
	 * @param   {event}          event   Event
	 */
	openGroupParent: function openGroupParent(event)
	{
		var parent = this.itemGroup.contextItem.parent;
		if(parent)
			this.openURICallback(parent.URI.spec, event);
	},
};

ListItemBase.setupModule(ListBase);