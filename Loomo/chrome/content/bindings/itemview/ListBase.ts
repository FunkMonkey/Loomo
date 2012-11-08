// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================

import LogUtils = module("../../modules/Utils/log");
import XBLUtils = module("../../modules/Utils/XBLUtils");
import MListItemBase = module("ListItemBase");
import MItem = module("../../modules/Item");
import MGroup = module("../../modules/Group");

export interface IListElement extends XULElement {
    impl: ListBase;
}

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
export class ListBase {

    node: IListElement;
    itemGroup: MGroup.Group;
    items: MListItemBase.ListItemBase[];
    selectedItems: MListItemBase.ListItemBase[];
    openURICallback: (url: string, e: Event) => void;

    constructor(node: IListElement)
    {
	    this.node = node;
	    this.itemGroup = null;
	    this.items = [];
	    this.selectedItems = [];
	    this.openURICallback = null;
    };

	/**
	 * Loads the view from the given group
	 * 
	 * @param   {Group}   group   Group to load from
	 */
	loadFromItemGroup(group: MGroup.Group)
	{
		this.itemGroup = group;
		this._loadItems();
	}

    _loadItems() { throw new Error("Not implemented!"); }
	
	
	/**
	 * Adds the given item to the selection
	 * 
	 * @param   {ListItemBase|Item|nsIURI|string}   item   Item to add
	 */
	addItemToSelection(item: MListItemBase.ListItemBase)
	{
		var listItem = this.getListItem(item);
		if(!listItem)
			throw new Error("Passed item does not belong to this view or maybe even unsupported argument (take care when passing URI's as strings)");
		
		this.addListItemToSelection(listItem);
	}
	
	/**
	 * Adds the given item to the selection
	 * 
	 * @param   {ListItemBase}   listItem   Item to add
	 */
	addListItemToSelection(listItem: MListItemBase.ListItemBase)
	{
		if(!listItem.isSelected)
		{
			listItem._isSelected = true;
			this.selectedItems.push(listItem);
		}
		else
			throw new Error("Tried to add already selected item to selection");
	}
	
	/**
	 * Removes the given item from the selection
	 * 
	 * @param   {ListItemBase|Item|nsIURI|string}   item   Item to remove
	 */
	removeItemFromSelection(item: MListItemBase.ListItemBase)
	{
		var listItem = this.getListItem(item);
		if(!listItem)
			throw new Error("Passed item does not belong to this view or maybe even unsupported argument (take care when passing URI's as strings)");
		
		this.removeListItemFromSelection(listItem);
	}
	
	/**
	 * Removes the given item from the selection
	 * 
	 * @param   {ListItemBase}   listItem   Item to remove
	 */
	removeListItemFromSelection(listItem: MListItemBase.ListItemBase)
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
	}
	
	/**
	 * Toggles the selection of the given item
	 * 
	 * @param   {ListItemBase|Item|nsIURI|string}   item   Item to toggle selection
	 */
	toggleItemSelection(item: MListItemBase.ListItemBase)
	{
		var listItem = this.getListItem(item);
		if(!listItem)
			throw new Error("Passed item does not belong to this view or maybe even unsupported argument (take care when passing URI's as strings)");
		
		this.toggleListItemSelection(listItem);
	}
	
	/**
	 * Toggles the selection of the given item
	 * 
	 * @param   {ListItemBase}   listItem   Item to toggle selection
	 */
	toggleListItemSelection(listItem: MListItemBase.ListItemBase)
	{
		if(listItem.isSelected)
			this.removeListItemFromSelection(listItem);
		else
			this.addListItemToSelection(listItem);
	}
	
	/**
	 * Clears the selection
	 */
	clearSelection()
	{
		for(var i = 0, len = this.selectedItems.length; i < len; ++i)
			this.selectedItems[i]._isSelected = false;

		this.selectedItems.length = 0;
	}
	
	/**
	 * Returns the according ListItemBase node for the given input in the given array
	 * 
	 * @param   {ListItemBase|Item|nsIURI|string}   itemOrURIorSpecIn   Input to search for
	 * @param   {Array}                             array               Array to search in
	 * 
	 * @returns {ListItemBase}   Found node or null
	 */
    getListItemIn(itemOrURIorSpecIn: string, array: MListItemBase.ListItemBase[]): MListItemBase.ListItemBase;
	getListItemIn(itemOrURIorSpecIn: MItem.Item, array: MListItemBase.ListItemBase[]): MListItemBase.ListItemBase;
	getListItemIn(itemOrURIorSpecIn: MListItemBase.ListItemBase, array: MListItemBase.ListItemBase[]): MListItemBase.ListItemBase;
    getListItemIn(itemOrURIorSpecIn: any, array: MListItemBase.ListItemBase[]): MListItemBase.ListItemBase
	{
		if(itemOrURIorSpecIn instanceof MListItemBase.ListItemBase)
		{
			for(var i = 0, len = array.length; i < len; ++i)
			{
				var listItem = array[i];
				if(listItem === itemOrURIorSpecIn || listItem.item === itemOrURIorSpecIn.item || listItem.item.URIspec === itemOrURIorSpecIn.item.URIspec)
					return listItem;
			}
		}
		else if(itemOrURIorSpecIn instanceof MItem.Item)
		{
			for(var i = 0, len = array.length; i < len; ++i)
			{
				var listItem = array[i];
				if(listItem.item === itemOrURIorSpecIn || listItem.item.URIspec === itemOrURIorSpecIn.URIspec)
					return listItem;
			}
		}
		else if(itemOrURIorSpecIn instanceof Components.interfaces.nsIURI)
		{
			for(var i = 0, len = array.length; i < len; ++i)
			{
				var listItem = array[i];
				if(listItem.item.URIspec === itemOrURIorSpecIn.spec)
					return listItem;
			}
		}
		else if(typeof(itemOrURIorSpecIn) === "string")
		{
			for(var i = 0, len = array.length; i < len; ++i)
			{
				var listItem = array[i];
				if(listItem.item.URIspec === itemOrURIorSpecIn)
					return listItem;
			}
		}
			
		return null;
	}
	
	/**
	 * Returns the according ListItemBase node for the given input
	 *    - searches in the items of the list
	 * 
	 * @param   {ListItemBase|Item|nsIURI|string}   itemOrURIorSpecIn   Input to search for
	 * 
	 * @returns {ListItemBase}   Found node or null
	 */
    getListItem(itemOrURIorSpecIn: string): MListItemBase.ListItemBase;
	getListItem(itemOrURIorSpecIn: MItem.Item): MListItemBase.ListItemBase;
	getListItem(itemOrURIorSpecIn: MListItemBase.ListItemBase): MListItemBase.ListItemBase;
    getListItem(itemOrURIorSpecIn: any): MListItemBase.ListItemBase
	{
		return this.getListItemIn(itemOrURIorSpecIn, this.items);
	}
	
	/**
	 * Returns the according ListItemBase node for the given input in the selected items
	 * 
	 * @param   {ListItemBase|Item|nsIURI|string}   itemOrURIorSpecIn   Input to search for
	 * 
	 * @returns {ListItemBase}   Found node or null
	 */
    getListItemInSelection(itemOrURIorSpecIn: string): MListItemBase.ListItemBase;
	getListItemInSelection(itemOrURIorSpecIn: MItem.Item): MListItemBase.ListItemBase;
	getListItemInSelection(itemOrURIorSpecIn: MListItemBase.ListItemBase): MListItemBase.ListItemBase;
    getListItemInSelection(itemOrURIorSpecIn: any): MListItemBase.ListItemBase
	{
		return this.getListItemIn(itemOrURIorSpecIn, this.selectedItems);
	}
	
	/**
	 * Opens the given item with the given event
	 * 
	 * @param   {ListItemBase}   item    Item to open
	 * @param   {event}          event   Event
	 */
	openListItem(item: MListItemBase.ListItemBase, event: Event)
	{
		var self = this;
		item.item.open().then(function(res){
				if(res !== ".")
					self.openURICallback(res, event);
			}, function(e){
				LogUtils.log(e);
			});
	}
	
	/**
	 * Opens the parent of the group
	 * 
	 * @param   {event}          event   Event
	 */
	openGroupParent(event)
	{
		var parent = this.itemGroup.contextItem.parent;
		if(parent)
			this.openURICallback(parent.URIspec, event);
	}
};

MListItemBase.setupListBase(ListBase);