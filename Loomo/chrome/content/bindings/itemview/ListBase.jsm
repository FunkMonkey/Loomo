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
 * @param   {element}   node   The connected DOM element
 */
ListBase = function ListBase(node)
{
	this.node = node;
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
		listItem = this.getListItem(item);
		if(!listItem)
			throw new Error("Passed item does not belong to this view or maybe even unsupported argument (take care when passing URI's as strings)");
		
		this.addListItemToSelection(listItem);
	},
	
	/**
	 * Adds the given item to the selection
	 * 
	 * @param   {ListItemBase}   listItem   Item to add
	 */
	addListItemToSelection: function _addListItemToSelection(listItem)
	{
		if(!listItem.isSelected)
		{
			listItem._isSelected = true;
			this.selectedItems.push(listItem);
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
		listItem = this.getListItem(item);
		if(!listItem)
			throw new Error("Passed item does not belong to this view or maybe even unsupported argument (take care when passing URI's as strings)");
		
		this.removeListItemFromSelection(listItem);
	},
	
	/**
	 * Removes the given item from the selection
	 * 
	 * @param   {ListItemBase}   listItem   Item to remove
	 */
	removeListItemFromSelection: function removeListItemFromSelection(listItem)
	{
		if(listItem.isSelected)
		{
			for (var i = 0; i < this.selectedItems.length; ++i)
			{
				if(this.selectedItems[i] === listItem)
				{
					this.selectedItems.splice(i, 1);
					listItem._isSelected = false;
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
		listItem = this.getListItem(item);
		if(!listItem)
			throw new Error("Passed item does not belong to this view or maybe even unsupported argument (take care when passing URI's as strings)");
		
		this.toggleListItemSelection(listItem);
	},
	
	/**
	 * Toggles the selection of the given item
	 * 
	 * @param   {ListItemBase}   listItem   Item to toggle selection
	 */
	toggleListItemSelection: function _toggleListItemSelection(listItem)
	{
		if(listItem.isSelected)
			this.removeListItemFromSelection(listItem);
		else
			this.addListItemToSelection(listItem);
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
	getListItemIn: function getListItemIn(itemOrURIorSpecIn, array)
	{
		if(itemOrURIorSpecIn instanceof ListItemBase)
		{
			for(var i = 0, len = array.length; i < len; ++i)
			{
				var listItem = array[i];
				if(listItem === itemOrURIorSpecIn || listItem.item === itemOrURIorSpecIn.item || listItem.item.URI.spec === itemOrURIorSpecIn.item.URI.spec)
					return listItem;
			}
		}
		else if(itemOrURIorSpecIn instanceof Item)
		{
			for(var i = 0, len = array.length; i < len; ++i)
			{
				var listItem = array[i];
				if(listItem.item === itemOrURIorSpecIn || listItem.item.URI.spec === itemOrURIorSpecIn.URI.spec)
					return listItem;
			}
		}
		else if(itemOrURIorSpecIn instanceof Components.interfaces.nsIURI)
		{
			for(var i = 0, len = array.length; i < len; ++i)
			{
				var listItem = array[i];
				if(listItem.item.URI.spec === itemOrURIorSpecIn.spec)
					return listItem;
			}
		}
		else if(typeof(itemOrURIorSpecIn) === "string")
		{
			for(var i = 0, len = array.length; i < len; ++i)
			{
				var listItem = array[i];
				if(listItem.item.URI.spec === itemOrURIorSpecIn)
					return listItem;
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
	getListItem: function getListItem(itemOrURIorSpecIn)
	{
		return this.getListItemIn(itemOrURIorSpecIn, this.items);
	},
	
	/**
	 * Returns the according ListItemBase node for the given input in the selected items
	 * 
	 * @param   {ListItemBase|Item|nsIURI|string}   itemOrURIorSpecIn   Input to search for
	 * 
	 * @returns {ListItemBase}   Found node or null
	 */
	getListItemInSelection: function getListItemInSelection(itemOrURIorSpecIn)
	{
		return this.getListItemIn(itemOrURIorSpecIn, this.selectedItems);
	},
	
	/**
	 * Opens the given item with the given event
	 * 
	 * @param   {ListItemBase}   item    Item to open
	 * @param   {event}          event   Event
	 */
	openListItem: function openListItem(item, event)
	{
		var self = this;
		item.item.open().then(function(res){
				if(res !== ".")
					self.openURICallback(res, event);
			}, function(e){
				log(e);
			});
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
			this.openURICallback(parent.URIspec, event);
	},
};

ListItemBase.setupModule(ListBase);