var EXPORTED_SYMBOLS = ["SimpleListItem"];

Components.utils.import("chrome://fibro/content/modules/Utils/log.jsm");
Components.utils.import("chrome://fibro/content/modules/Utils/Extension.jsm");
Components.utils.import("chrome://fibro/content/modules/Utils/XBLUtils.jsm");
Components.utils.import("chrome://fibro/content/bindings/itemview/ListItemBase.jsm");

/**
 * Item for a simple list view
 *
 * @constructor
 * @param   {element}   node   The connected DOM element
 */
SimpleListItem = function SimpleListItem(node)
{
	ListItemBase.call(this, node);
	
	this._DOMIcon = XBLUtils.getAnonNode(this.node, "icon");
	this._DOMLabel = XBLUtils.getAnonNode(this.node, "label");
	this._DOMSpacer = XBLUtils.getAnonNode(this.node, "spacer");
	
	this._DOMIcon.addEventListener("click", this.onClick.bind(this), false);
	this._DOMIcon.addEventListener("dblclick", this.onDoubleClick.bind(this), false);
	this._DOMLabel.addEventListener("click", this.onClick.bind(this), false);
	this._DOMLabel.addEventListener("dblclick", this.onDoubleClick.bind(this), false);
	
	this._DOMSpacer.addEventListener("click", this.onSpacerClick.bind(this), false);
	this._DOMSpacer.addEventListener("dblclick", this.onSpacerDblClick.bind(this), false);
	
	this.scrollListener = this.onParentScroll.bind(this);
	this.node.parentNode.addEventListener("scroll", this.scrollListener, false);
};

SimpleListItem.prototype = {
	
	constructor: SimpleListItem,
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	setItem: function setItem(item)
	{
		this.item = item;	
		
		// set some attributes
		this.node.setAttribute("class", "itemview_item");
		this.node.setAttribute("urispec", this.item.URIspec);
		
		this.setupIcon();
		
		this._DOMLabel.setAttribute("value", this.item.getDisplayName()); 
	},
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	setupIcon: function setupIcon()
	{
		if(!this.iconSetup && this.isVisibleInScroll())
		{
			var self = this;
			this.item.getIconURIString(16).then(function(res){
				self.iconURI = res;
				self._DOMIcon.setAttribute("src", self.iconURI);
				self.node.parentNode.removeEventListener("scroll", self.scrollListener, false);
				self.iconSetup = true;
			});
		}
	},
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
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

	},
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	onParentScroll: function onParentScroll(event)
	{
		this.setupIcon();
	},
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	isVisibleInScroll: function isVisibleInScroll()
	{
		//logI("offset: " + this.boxObject.y + " " + this.parentNode.scrollTop + " " + this.parentNode.scrollHeight + " " + this.parentNode.boxObject.height);
		return (this.node.boxObject.y > this.node.parentNode.scrollTop && (this.node.boxObject.y < (this.node.parentNode.scrollTop + this.node.parentNode.boxObject.height)));
	},
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	onDoubleClick: function onDoubleClick(event)
	{
		this.list.openListItem(this, event);
	},
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	onSpacerClick: function onSpacerClick(event)
	{
		this.list.clearSelection();
	},
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	onSpacerDblClick: function onSpacerDblClick(event)
	{
		this.list.openGroupParent(event);
	},
	
};

Extension.inherit(SimpleListItem, ListItemBase);