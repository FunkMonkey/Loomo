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

/**
 * Represents the DOM element that holds a reference to a SimpleListItem
 */
export interface ISimpleListItemElement extends MListItemBase.IListItemElement {

	/**
     * References the connected SimpleListItem
     */
    impl: SimpleListItem;
}

/**
 * ListItem for a simple list view
 *
 * @constructor
 * @param   {element}   node   The connected DOM element
 */
export class SimpleListItem extends MListItemBase.ListItemBase {

	/**
	 * Reference to the DOMElement for the icon
	 */
    _DOMIcon: XULElement;

    /**
	 * Reference to the DOMElement for the label
	 */
    _DOMLabel: XULElement;

    /**
	 * Reference to the DOMElement for the spacer
	 */
    _DOMSpacer: XULElement;

    /**
     * State of the icon (is it already set up or not?)
     */
    iconSetup: bool;

    /**
     * URI spec of the icon
     */
    iconURI: string;

    /**
     * EventListener used for scrolling
     */
    scrollListener: EventListener;

    /**
	 * ListItem for a simple list view
	 *
	 * @constructor
	 * @param   node   The connected DOM element
	 */
    constructor(node: ISimpleListItemElement)
    {
        super(node);
	
	    this._DOMIcon = XBLUtils.getAnonNode(this.node, "icon");
	    this._DOMLabel = XBLUtils.getAnonNode(this.node, "label");
	    this._DOMSpacer = XBLUtils.getAnonNode(this.node, "spacer");
	
		// TODO: remove eventListeners when appropriate
	    this._DOMIcon.addEventListener("click", <EventListener>this.onClick.bind(this), false);
	    this._DOMIcon.addEventListener("dblclick", <EventListener>this.onDoubleClick.bind(this), false);
	    this._DOMLabel.addEventListener("click", <EventListener>this.onClick.bind(this), false);
	    this._DOMLabel.addEventListener("dblclick", <EventListener>this.onDoubleClick.bind(this), false);
	
	    this._DOMSpacer.addEventListener("click", <EventListener>this.onSpacerClick.bind(this), false);
	    this._DOMSpacer.addEventListener("dblclick", <EventListener>this.onSpacerDblClick.bind(this), false);
	
	    this.scrollListener = <EventListener>this.onParentScroll.bind(this);
	    this.node.parentNode.addEventListener("scroll", this.scrollListener, false);
    };

	
	/**
	 * Sets the Item (File, etc.) that this ListItem represents
	 *
	 * @param   item   Item to set
	 */
	setItem(item: MItem.Item)
	{
		this.item = item;	
		
		// set some attributes
		this.node.setAttribute("class", "itemview_item");
		this.node.setAttribute("urispec", this.item.URIspec);
		
		this.setupIcon();
		
		this._DOMLabel.setAttribute("value", this.item.getDisplayName()); 
	}

	/**
	 * Sets up the icon
	 */
	setupIcon()
	{
		// only setup icons that are visible
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
	
	/**
	 * Called when item was clicked on
	 *    - handles selection, opening, etc
	 *
	 * @param   event   Click event
	 */
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
	
	/**
	 * Called when the parent list was scrolled
	 *
	 * @param   event   Scroll event
	 */
	onParentScroll(event: MouseWheelEvent)
	{
		this.setupIcon();
	}
	
	/**
	 * Determines if the element is visible in the scrolled area
	 *
	 * @returns   True if visible, otherwise false
	 */
	isVisibleInScroll()
	{
		//logI("offset: " + this.boxObject.y + " " + this.parentNode.scrollTop + " " + this.parentNode.scrollHeight + " " + this.parentNode.boxObject.height);
		return (this.node.boxObject.y > (<XULElement>this.node.parentNode).scrollTop && (this.node.boxObject.y < ((<XULElement>this.node.parentNode).scrollTop + (<XULElement>this.node.parentNode).boxObject.height)));
	}
	
	/**
	 * Called when item was double-clicked on
	 *    - opens the connected Item
	 *
	 * @param   event   Click event
	 */
	onDoubleClick(event: MouseEvent)
	{
		this.list.openListItem(this, event);
	}
	
	/**
	 * Called when item's white space was clicked on
	 *    - clears the list's selection
	 *
	 * @param   event   Click event
	 */
	onSpacerClick(event: MouseEvent)
	{
		this.list.clearSelection();
	}
	
	/**
	 * Called when item's white space was double-clicked on
	 *    - opens the Group's parent 
	 *
	 * @param   event   Click event
	 */
	onSpacerDblClick(event: MouseEvent)
	{
		this.list.openGroupParent(event);
	}
	
};