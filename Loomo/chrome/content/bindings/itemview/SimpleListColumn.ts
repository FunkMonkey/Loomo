// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================

import XBLUtils = module("../../modules/Utils/XBLUtils");
import MSimpleList = module("SimpleList");

/**
 * Represents the DOM element that holds a reference to a SimpleListColumn
 */
export interface ISimpleListColumnElement extends XULElement {

	/**
	 * References the connected SimpleListColumn
	 */
	impl: SimpleListColumn;
}

/**
 * Column for a simple list view
 */
export class SimpleListColumn {
	
	/**
	 * References the connected DOM element
	 */
	node: ISimpleListColumnElement;

	/**
	 * Reference to parent list
	 */
	_list: MSimpleList.SimpleList;

	/**
	 * Column for a simple list view
	 *
	 * @constructor
	 * @param   node   The connected DOM element
	 */
	constructor(node: ISimpleListColumnElement) {
		this.node = node;
		this._list = null;
	
		this.node.addEventListener("click", <(e: Event) => void>(this.onClick.bind(this)), false);
		this.node.addEventListener("dblclick", <(e: Event) => void>(this.onDblClick.bind(this)), false);
	}
	
	
	/**
	 * Reference to parent list
	 *   - will search for the list, when called the first time
	 */
	get list() : MSimpleList.SimpleList {
		// if we already found our control, then return it (save some performance)
		if(this._list)
			return this._list;
		
		// otherwise look for the control
		// TODO: make it MListBase.IListElement, when http://typescript.codeplex.com/workitem/386 is fixed
		var parent = <any>this.node.parentNode;
		while (parent) {
			if (parent.impl && parent.impl instanceof MSimpleList.SimpleList) {
				this._list = parent.impl;
				return this._list;
			}
			parent = parent.parentNode;
		}
		
		return null;
	}
	
	/**
	 * Called when the column's white space was clicked
	 *    - clears the list's selection
	 *
	 * @param   event   Click event
	 */
	onClick(event: MouseEvent) {
		if(event.target === this.node)
			this.list.clearSelection();
	}
	
	/**
	 * Called when the column's white space was double-clicked
	 *    - opens the Group's parent 
	 *
	 * @param   event   Click event
	 */
	onDblClick(event: MouseEvent) {
		if(event.target === this.node)
			this.list.openGroupParent(event);
	}
	
};