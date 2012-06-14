var EXPORTED_SYMBOLS = ["SimpleListItem"];

Components.utils.import("chrome://fibro/content/modules/Utils/log.jsm");
Components.utils.import("chrome://fibro/content/modules/Utils/Extension.jsm");
Components.utils.import("chrome://fibro/content/modules/Utils/XBLUtils.jsm");
Components.utils.import("chrome://fibro/content/bindings/itemview/ListItemBase.jsm");

/**
 * Item for a simple list view
 *
 * @constructor
 */
SimpleListItem = function SimpleListItem()
{
	XBLUtils.inherit(this, SimpleListItem);
	ListItemBase.call(this);
	
	this._DOMIcon = XBLUtils.getAnonNode(this, "icon");
	this._DOMLabel = XBLUtils.getAnonNode(this, "label");
	this._DOMSpacer = XBLUtils.getAnonNode(this, "spacer");
	
	this._DOMIcon.addEventListener("click", this.onClick.bind(this), false);
	this._DOMIcon.addEventListener("dblclick", this.onDoubleClick.bind(this), false);
	this._DOMLabel.addEventListener("click", this.onClick.bind(this), false);
	this._DOMLabel.addEventListener("dblclick", this.onDoubleClick.bind(this), false);
	
	this._DOMSpacer.addEventListener("click", this.onSpacerClick.bind(this), false);
	this._DOMSpacer.addEventListener("dblclick", this.onSpacerDblClick.bind(this), false);
	
	this.scrollListener = this.onParentScroll.bind(this);
	this.parentNode.addEventListener("scroll", this.scrollListener, false);
};

SimpleListItem.prototype = {
	
	constructor: SimpleListItem,
	
	//覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧
	/// 
	//覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧
	setItem: function setItem(item)
	{
		this.item = item;	
		
		// set some attributes
		this.setAttribute("class", "itemview_item");
		this.setAttribute("urispec", this.item.URI.spec);
		
		this.iconURI = this.item.getIconURIString(16);
		
		this.setupIcon();
		
		this._DOMLabel.setAttribute("value", this.item.getDisplayName()); 
	},
	
	//覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧
	/// 
	//覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧
	setupIcon: function setupIcon()
	{
		if(!this.iconSetup && this.isVisibleInScroll())
		{
			this._DOMIcon.setAttribute("src", this.iconURI);
			this.parentNode.removeEventListener("scroll", this.scrollListener, false);
			this.iconSetup = true;
		}
	},
	
	//覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧
	/// 
	//覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧
	onClick: function onClick(event)
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
				this.list.toggleDOMItemSelection(this);
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
					this.list.addDOMItemToSelection(this);
				}
			}
			//control._userSelecting = false;
		}

	},
	
	//覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧
	/// 
	//覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧
	onParentScroll: function onParentScroll(event)
	{
		this.setupIcon();
	},
	
	//覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧
	/// 
	//覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧
	isVisibleInScroll: function isVisibleInScroll()
	{
		//logI("offset: " + this.boxObject.y + " " + this.parentNode.scrollTop + " " + this.parentNode.scrollHeight + " " + this.parentNode.boxObject.height);
		return (this.boxObject.y > this.parentNode.scrollTop && (this.boxObject.y < (this.parentNode.scrollTop + this.parentNode.boxObject.height)));
	},
	
	//覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧
	/// 
	//覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧
	onDoubleClick: function onDoubleClick(event)
	{
		this.open(event);
	},
	
	//覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧
	/// 
	//覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧
	onSpacerClick: function onSpacerClick(event)
	{
		this.list.clearSelection();
	},
	
	//覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧
	/// 
	//覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧
	onSpacerDblClick: function onSpacerDblClick(event)
	{
		this.openGroupParent(event);
	},
	
};

Extension.inherit(SimpleListItem, ListItemBase);