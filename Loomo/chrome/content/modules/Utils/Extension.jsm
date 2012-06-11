var EXPORTED_SYMBOLS = ["Extension"];

/**
 * Provides functionality for object extension
 * @namespace
 * 
 * @type Object
 */
var Extension =
{
	// TODO: remove as FF only
	/**
	 * Inherits from a given class by setting the prototype
	 * 
	 * @param   {Object}   child   Child class
	 * @param   {Object}   base    Base class
	 */
	inherit: function inherit(child, supertype)
	{
		child.prototype.__proto__ = supertype.prototype;
	},
	
	/**
	 * Inherits from a given class by setting the prototype
	 * 
	 * @param   {Object}   child   Child class
	 * @param   {Object}   base    Base class
	 */
	inheritNew: function inheritNew(child, base)
	{
		var oldProto = child.prototype;
		child.prototype = Object.create(base);
		
		// getting the correct properties
		var propNames = Object.getOwnPropertyNames(oldProto);
		for(var i = 0, len = propNames.length; i < len; ++i)
			Object.defineProperty(child.prototype, propNames[i], Object.getOwnPropertyDescriptor(oldProto, propNames[i]));
	}, 
	
	/**
	 * Borrows properties from the given object
	 * 
	 * @param   {Object} to      Object to add properties to
	 * @param   {Object} from    Object to get properties from
	 * @param   {Object} options Options to set
	 */
	borrow: function borrow(to, from, options)
	{
		if(!options)
			options = Extension.borrow.stdOptions;
		
		var chain = [];
		
		if(options.ownPropsOnly)
		{
			chain.push(from);
		}
		else
		{
			// creating the inheritence chain
			var currObj = from;
			while(currObj)
			{
				chain.push(currObj);
				
				// go down further in the inheritence chain
				// don't copy Object.prototype
				var proto = Object.getPrototypeOf(currObj);
				
				// dirty hack, cannot check for Object.prototype sometimes (f. ex. in different js contexts)
				// thus checking for a member
				currObj = proto.hasOwnProperty("hasOwnProperty") ? null : proto; 
			}
		}
		
		var borrowedProps = {};
		
		// go through the inheritence chain
		for(var i = 0; i < chain.length; ++i)
		{
			var propNames = Object.getOwnPropertyNames(chain[i]);
			
			// copy all property descriptors over to "to"
			for(var j = 0; j < propNames.length; ++j)
			{
				// don't copy, if prop has already been borrowed from up in the chain
				if(borrowedProps[propNames[j]])
					continue;
				
				// don't overwrite existing properties
				if(!options.overwriteExisting && (propNames[j] in to))
					continue;
				
				// copy the property
				var prop = Object.getOwnPropertyDescriptor(chain[i], propNames[j]);
				
				// TODO: filter for different types of properties
				if(options.usePropFilters)
				{
					if( (!prop.writable && !options.borrowNonWritable) ||
					    (!prop.configurable && !options.borrowNonConfigurable) ||
						(!prop.enumerable && !options.borrowNonEnumerable))
						continue;
					
					// is an accessor
					if(prop.get || prop.set)
					{
						if(!options.borrowAccessors)
							continue;
					}
					else if(typeof(prop.value) === "function")
					{
						if(!options.borrowFunctions)
							continue;
					}
					else
					{
						if(!options.borrowNonFunctionValues)
							continue;
					}
				}
				
				Object.defineProperty(to, propNames[j], prop);
				borrowedProps[propNames[j]] = true;
			}
		}
	},
	
	/**
	 * Creates an instance of the given class with arguments given as an array
	 *    see http://www.bennadel.com/blog/2291-Invoking-A-Native-JavaScript-Constructor-Using-Call-Or-Apply-.htm
	 * 
	 * @param   {Function}   constructorFunc   Constructor function
	 * @param   {Array}      arguments         Array of arguments
	 * 
	 * @returns {Object}   Newly created object
	 */
	createInstance: function createInstance(constructorFunc, args)
	{
		// Create an object that extends the target prototype
		var newInstance = Object.create(constructorFunc.prototype);
		
		// Invoke the custom constructor on the new object,
		// passing in any arguments that were provided.
		newInstance = (constructorFunc.apply( newInstance, args ) || newInstance);
		
		// Return the newly created friend.
		return newInstance;
	},
	
	/**
	 * Checks if the given object is an instance of the given constructor function
	 *    uses obj._classList internally
	 * 
	 * @param   {Object}     obj               Object to check
	 * @param   {Function}   constructorFunc   Constructor function
	 *
	 * @returns {boolean}   True if instance of, otherwise false
	 */
	isInstanceOf: function isInstanceOf(obj, constructorFunc)
	{
		if(obj instanceof constructorFunc)
			return true;
		
		if(obj._classList)
		{
			for(var i = 0, len = obj._classList.length; i < len; ++i)
			{
				if(constructorFunc === obj._classList[i])
					return true;
			}
		}
		
		return false;
	},
	
	/**
	 * Checks if the given object is an instance of the given constructor function
	 *    uses obj._classList internally
	 * 
	 * @param   {Object}     obj               Object to check
	 * @param   {Function}   constructorFunc   Constructor function
	 *
	 * @returns {boolean}   True if instance of, otherwise false
	 */
	isInstanceOfByString: function isInstanceOfByString(obj, constructorFunc)
	{
		if(obj instanceof constructorFunc || (obj.constructor && obj.constructor.name === constructorFunc.name))
			return true;
		
		if(obj._classList)
		{
			for(var i = 0, len = obj._classList.length; i < len; ++i)
			{
				if(constructorFunc.name === obj._classList[i].name)
					return true;
			}
		}
		
		return false;
	},
	
	
};

Extension.borrow.stdOptions = {
	ownPropsOnly: false,
	overwriteExisting: false,
	
	// filters
	usePropFilters: false,
	
	borrowAccessors: true,
	borrowFunctions: true,
	borrowNonFunctionValues: true,
	borrowNonEnumerable: true,
	borrowNonConfigurable: true,
	borrowNonWritable: true,
}
