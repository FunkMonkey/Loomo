
var EXPORTED_SYMBOLS = ["Container"];

Components.utils.import("chrome://fibro/content/modules/Utils/XBLUtils.jsm");

/**
 * Represents a container for views
 *
 * @constructor
 * @param   {element}   node   The connected DOM element
 */
Container = function Container(node)
{
	this.node = node;
};

Container.prototype = {
	
	constructor: Container,
	
};

