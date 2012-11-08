// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================

import XBLUtils = module("../../modules/Utils/XBLUtils");
import MSimpleList = module("SimpleList");

export interface ISimpleListColumnElement extends XULElement {
    impl: SimpleListColumn;
}

/**
 * Column for a simple list view
 *
 * @constructor
 * @param   {element}   node   The connected DOM element
 */
export class SimpleListColumn {
    
    node: ISimpleListColumnElement;
    _list: MSimpleList.SimpleList;

    constructor(node: ISimpleListColumnElement)
    {
	    this.node = node;
	    this._list = null;
	
	    this.node.addEventListener("click", <(e: Event) => void>(this.onClick.bind(this)), false);
	    this.node.addEventListener("dblclick", <(e: Event) => void>(this.onDblClick.bind(this)), false);
	
    }
	
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	get list() : MSimpleList.SimpleList
	{
		// if we already found our control, then return it (save some performance)
		if(this._list)
			return this._list;
		
		// otherwise look for the control
        // TODO: make it MListBase.IListElement, when http://typescript.codeplex.com/workitem/386 is fixed
		var parent = <any>this.node.parentNode;
		while (parent)
		{
			if (parent.impl && parent.impl instanceof MSimpleList.SimpleList)
			{
				this._list = parent.impl;
				return this._list;
			}
			parent = parent.parentNode;
		}
		
		return null;
	}
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	onClick(event: MouseEvent)
	{
		if(event.target === this.node)
			this.list.clearSelection();
	}
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	onDblClick(event)
	{
		if(event.target === this.node)
			this.list.openGroupParent(event);
	}
	
};

