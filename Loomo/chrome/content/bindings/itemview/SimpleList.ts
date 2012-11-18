// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================

import XBLUtils = module("../../modules/Utils/XBLUtils");

import MListBase = module("ListBase");
import MSimpleListItem = module("SimpleListItem");
import MSimpleListColumn = module("SimpleListColumn");
import MItem = module("../../modules/Item");

/**
 * Represents the DOM element that holds a reference to a SimpleList
 */
export interface ISimpleListElement extends MListBase.IListElement {
	/**
	 * References the connected SimpleList
	 */
	impl: SimpleList;
}

/**
 * Represents a simple list view
 */
export class SimpleList extends MListBase.ListBase {
	
	/**
	 * Represents a simple list view
	 *
	 * @constructor
	 * @param   node   The connected DOM element
	 */
	constructor(node: ISimpleListElement) {
		super(node);
	}

	/**
	 * Creates a SimpleListItem for the given Item (File or whatever) and appends it to the list
	 *
	 * @param   item   Item to create SimpleListItem for
	 * @param   column   Column to append new item to
	 *
	 * @returns   The newly created SimpleListItem
	 */
	_appendItem(item: MItem.Item, column: MSimpleListColumn.ISimpleListColumnElement): MSimpleListItem.SimpleListItem {
		var cell = <MSimpleListItem.ISimpleListItemElement>(this.node.ownerDocument.createElement("simple_list_item"));
		column.appendChild(cell);
		this.items.push(cell.impl);
		cell.impl.setItem(item);
		
		return cell.impl; 
	}
	
	/**
	 * Loads all the items
	 */
	_loadItems() {
		// AccessCount
		
		//var list = this.ownerDocument.getAnonymousNodes(this)[0].childNodes[0];
		var list = <MSimpleListColumn.ISimpleListColumnElement>XBLUtils.getAnonNode(this.node, "column");
		
		// TODO: clear the list at the beginning or something like that
		for(var i = 0, len = this.itemGroup.length; i < len; ++i) {
			this._appendItem(this.itemGroup[i], list);
		}
	}

	/**
	 * Selects all the items in the given range
	 *
	 * @param   startListItem   SimpleListItem to start
	 * @param   endListItem     SimpleListItem to end
	 */
	_selectListItemRange(startListItem: MSimpleListItem.SimpleListItem, endListItem: MSimpleListItem.SimpleListItem) {
		if(!startListItem && !endListItem)
			this.clearSelection();
			
			// Don't forget visibility!!!
	}
	
};