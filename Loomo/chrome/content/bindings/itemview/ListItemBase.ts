// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================

import MListBase = module("ListBase");
import XBLUtils = module("../../modules/Utils/XBLUtils");
import MItem = module("../../modules/Item");


var ListBaseFunc: Function = null;

export interface IListItemElement extends XULElement {
    impl: ListItemBase;
}


/**
 * Base for list view items
 *
 * @property {Item}       item    Item this list item is connected to
 * @property {ListBase}   list    List this node belongs to
 *
 * @constructor
 * @param   {element}   node   The connected DOM element
 */
export class ListItemBase {

    node: IListItemElement;
    item: MItem.Item;
    _list: MListBase.ListBase;

    constructor (node: IListItemElement) {
        this.node = node;
        this.item = null;
        this._list = null;
    }


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

	get isSelected(): bool {
        return this.node.hasAttribute("isSelected");
    }

	get _isSelected(): bool {
        return this.node.hasAttribute("isSelected");
    }

    set _isSelected(value: bool) {
        if (value)
            this.node.setAttribute("isSelected", "");
        else
            this.node.removeAttribute("isSelected");
    }

}

export function setupListBase(listBase: Function){ ListBaseFunc = listBase; };

