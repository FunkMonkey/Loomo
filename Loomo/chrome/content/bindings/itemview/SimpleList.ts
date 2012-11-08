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

export interface ISimpleListElement extends MListBase.IListElement {
    impl: SimpleList;
}

/**
 * A simple list view
 *
 * @constructor
 * @param   {element}   node   The connected DOM element
 */
export class SimpleList extends MListBase.ListBase {
    constructor(node: ISimpleListElement)
    {
        super(node);
    };

	_appendItem(item: MItem.Item, list: MSimpleListColumn.ISimpleListColumnElement): MSimpleListItem.SimpleListItem
	{
		var cell = <MSimpleListItem.ISimpleListItemElement>(this.node.ownerDocument.createElement("simple_list_item"));
		list.appendChild(cell);
		this.items.push(cell.impl);
		cell.impl.setItem(item);
		
		return cell.impl; 
	}
	

	_loadItems()
	{
		// AccessCount
		
		//var list = this.ownerDocument.getAnonymousNodes(this)[0].childNodes[0];
		var list = <MSimpleListColumn.ISimpleListColumnElement>XBLUtils.getAnonNode(this.node, "column");
		
		// TODO: clear the list at the beginning or something like that
		for(var i = 0, len = this.itemGroup.length; i < len; ++i)
		{
			this._appendItem(this.itemGroup[i], list);
		}
	}

	_selectListItemRange(startListItem: MSimpleListItem.ISimpleListItemElement, endListItem: MSimpleListItem.ISimpleListItemElement)
	{
		if(!startListItem && !endListItem)
			this.clearSelection();
			
			// Don't forget visibility!!!
	}
	
};

