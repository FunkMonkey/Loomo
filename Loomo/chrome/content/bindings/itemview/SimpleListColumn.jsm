var EXPORTED_SYMBOLS = ["SimpleListColumn"];

Components.utils.import("chrome://fibro/content/modules/Utils/XBLUtils.jsm");
Components.utils.import("chrome://fibro/content/bindings/itemview/ListBase.jsm");

/**
 * Column for a simple list view
 *
 * @constructor
 */
SimpleListColumn = function SimpleListColumn()
{
	XBLUtils.inherit(this, SimpleListColumn);
	
	this._list = null;
	
	this.addEventListener("click", this.onClick.bind(this), false);
	this.addEventListener("dblclick", this.onDblClick.bind(this), false);
	
};

SimpleListColumn.prototype = {
	
	constructor: SimpleListColumn,
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	get list()
	{
		// if we already found our control, then return it (save some performance)
		if(this._list)
			return this._list;
		
		// otherwise look for the control
		var parent = this.parentNode;
		while (parent)
		{
			if (parent instanceof ListBase)
			{
				this._list = parent;
				return this._list;
			}
			parent = parent.parentNode;
		}
		
		return null;
	},
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	onClick: function onClick(event)
	{
		if(event.target === this)
			this.list.clearSelection();
	},
	
	//——————————————————————————————————————————————————————————————————————————————————————
	/// 
	//——————————————————————————————————————————————————————————————————————————————————————
	onDblClick: function onDblClick(event)
	{
		if(event.target === this)
			this.list.openGroupParent(event);
	},
	
};

