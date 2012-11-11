// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================

import MListBase = module("ListBase");
import XBLUtils = module("../../modules/Utils/XBLUtils");
import MItem = module("../../modules/Item");


/**
 * Rereference to ListBase
 */
var ListBaseFunc: Function = null;

/**
 * Represents the DOM element that holds a reference to a ListItemBase
 */
export interface IListItemElement extends XULElement {
    
    /**
     * References the connected ListItemBase
     */
    impl: ListItemBase;
}


/**
 * Base class for list view items
 */
export class ListItemBase {

    /**
     * References the connected DOM element
     */
    node: IListItemElement;

    /**
     * Reference to the connected Item (file, etc.)
     */
    item: MItem.Item;

    /**
     * Reference to parent list
     */
    _list: MListBase.ListBase;

    /**
     * Base for list view items
     * 
     * @constructor
     * @param   node   The connected DOM element
     */
    constructor (node: IListItemElement) {
        this.node = node;
        this.item = null;
        this._list = null;
    }

    /**
     * Reference to parent list
     *   - will search for the list, when called the first time
     */
    get list(): MListBase.ListBase {
        // if we already found our control, then return it (save some performance)
        if (this._list)
            return this._list;

        // otherwise look for the control
        // TODO: make it MListBase.IListElement, when http://typescript.codeplex.com/workitem/386 is fixed
        var parent = <any>(this.node.parentNode);
        while (parent) {
            if (parent.impl && parent.impl instanceof ListBaseFunc) {
                this._list = parent.impl;
                return this._list;
            }
            parent = <any>parent.parentNode;
        }

        return null;
    }

    /**
     * Tells, whether the listitem is selected or not
     *
     * @returns True if selected, otherwise false
     */
	get isSelected(): bool {
        return this.node.hasAttribute("isSelected");
    }

    /**
     * Tells, whether the listitem is selected or not
     *
     * @returns True if selected, otherwise false
     */
	get _isSelected(): bool {
        return this.node.hasAttribute("isSelected");
    }

    /**
     * Sets the selected state of the listitem
     *    - for internal use only
     */
    set _isSelected(value: bool) {
        if (value)
            this.node.setAttribute("isSelected", "");
        else
            this.node.removeAttribute("isSelected");
    }

}

/**
 * Sets up ListBase, so it can be used for instanceOf checks within this module
 *
 * @param  listBase      ListBase constructor
 */
export function setupListBase(listBase: Function){ ListBaseFunc = listBase; };

