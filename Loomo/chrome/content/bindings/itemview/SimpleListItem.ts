// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================

import XBLUtils = module("../../modules/Utils/XBLUtils");

import LogUtils = module("../../modules/Utils/log");

import MListItemBase = module("ListItemBase");
import MItem = module("../../modules/Item");

export interface ISimpleListItemElement extends MListItemBase.IListItemElement {
    impl: SimpleListItem;
}

/**
 * Item for a simple list view
 *
 * @constructor
 * @param   {element}   node   The connected DOM element
 */
export class SimpleListItem extends MListItemBase.ListItemBase {

    _DOMIcon: XULElement;
    _DOMLabel: XULElement;
    _DOMSpacer: XULElement;

    iconSetup: bool;
    iconURI: string;

    scrollListener: EventListener;

    constructor(node: ISimpleListItemElement)
    {
        super(node);
	
	    this._DOMIcon = XBLUtils.getAnonNode(this.node, "icon");
	    this._DOMLabel = XBLUtils.getAnonNode(this.node, "label");
	    this._DOMSpacer = XBLUtils.getAnonNode(this.node, "spacer");
	
	    this._DOMIcon.addEventListener("click", <EventListener>this.onClick.bind(this), false);
	    this._DOMIcon.addEventListener("dblclick", <EventListener>this.onDoubleClick.bind(this), false);
	    this._DOMLabel.addEventListener("click", <EventListener>this.onClick.bind(this), false);
	    this._DOMLabel.addEventListener("dblclick", <EventListener>this.onDoubleClick.bind(this), false);
	
	    this._DOMSpacer.addEventListener("click", <EventListener>this.onSpacerClick.bind(this), false);
	    this._DOMSpacer.addEventListener("dblclick", <EventListener>this.onSpacerDblClick.bind(this), false);
	
	    this.scrollListener = <EventListener>this.onParentScroll.bind(this);
	    this.node.parentNode.addEventListener("scroll", this.scrollListener, false);
    };

	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	setItem(item: MItem.Item)
	{
		this.item = item;	
		
		// set some attributes
		this.node.setAttribute("class", "itemview_item");
		this.node.setAttribute("urispec", this.item.URIspec);
		
		this.setupIcon();
		
		this._DOMLabel.setAttribute("value", this.item.getDisplayName()); 
	}
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	setupIcon()
	{
		if(!this.iconSetup && this.isVisibleInScroll())
		{
			var self = this;
			this.item.getIconURIString(16).then(function(res){
				self.iconURI = res;
				self._DOMIcon.setAttribute("src", self.iconURI);
				self.node.parentNode.removeEventListener("scroll", self.scrollListener, false);
				self.iconSetup = true;
			}, function fail(e){
				LogUtils.logError(e);
			});
		}
	}
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	onClick(event: MouseEvent)
	{
		// handle middle-mouse-buttons
		if(event.button == 1)
		{
			this.onDoubleClick(event);
		}
		else
		{
			// TODO: handle disabled controls
			
			if (event.ctrlKey || event.metaKey)
			{
				this.list.toggleListItemSelection(this);
				//control.currentItem = this;
			}
			else if (event.shiftKey)
			{
				// TODO: implement
				//control.selectItemRange(null, this);
				//control.currentItem = this;
			}
			else {
				if(!this.isSelected)
				{
					this.list.clearSelection();
					this.list.addListItemToSelection(this);
				}
			}
			//control._userSelecting = false;
		}
	}
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	onParentScroll(event: MouseWheelEvent)
	{
		this.setupIcon();
	}
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	isVisibleInScroll()
	{
		//logI("offset: " + this.boxObject.y + " " + this.parentNode.scrollTop + " " + this.parentNode.scrollHeight + " " + this.parentNode.boxObject.height);
		return (this.node.boxObject.y > (<XULElement>this.node.parentNode).scrollTop && (this.node.boxObject.y < ((<XULElement>this.node.parentNode).scrollTop + (<XULElement>this.node.parentNode).boxObject.height)));
	}
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	onDoubleClick(event: MouseEvent)
	{
		this.list.openListItem(this, event);
	}
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	onSpacerClick(event: MouseEvent)
	{
		this.list.clearSelection();
	}
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	onSpacerDblClick(event: MouseEvent)
	{
		this.list.openGroupParent(event);
	}
	
};