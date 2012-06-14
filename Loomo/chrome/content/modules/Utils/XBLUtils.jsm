var EXPORTED_SYMBOLS = ["XBLUtils"];
	
	
var XBLUtils = {


	/**
	 * Returns the anonymous node of the given element with the given id
	 * 
	 * @param   {element}   elem     Element to search through
	 * @param   {string}    anonID   Id to find
	 * 
	 * @returns {element}   Found anonymous node
	 */
	getAnonNode: function getAnonNode(elem, anonID)
	{
		return elem.ownerDocument.getAnonymousElementByAttribute(elem, "anonid", anonID);
	}, 
	
	/**
	 * Returns the parent node with the given local name
	 * 
	 * @param   {element}   elem        Given node to find parent for
	 * @param   {string}    localName   Local name
	 * 
	 * @returns {element}   Parent node with local name
	 */
	getParentNodeByLocalName: function getParentNodeByLocalName(elem, localName)
	{
		var parent = elem.parentNode;
		while (parent)
		{
			if (parent.localName === localName)
				return parent;
			
			parent = parent.parentNode;
		}
		return null; 
	},
	
	/**
	 * Inserts the given prototype between the binding's prototype and the DOMElement prototype
	 *    - won't have an effect if prototype is already in the inheritance chain
	 * 
	 * @param   {Object}   xblNode     XBL node to add prototype to
	 * @param   {Object}   base        Base class
	 */
	inherit: function inherit(xblNode, base)
	{
		if(!xblNode.__proto__.protoSetup)
		{
			
			var domProto = xblNode.__proto__.__proto__;
			
			var prototype = base.prototype;
			var secondLastProto = prototype;
			while(secondLastProto.__proto__.__proto__)
				secondLastProto = secondLastProto.__proto__;
				
			secondLastProto.__proto__ = domProto;
			xblNode.__proto__.__proto__ = prototype;
			
			xblNode.__proto__.protoSetup = true;
		}	
	}, 
	
};

