// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================


// TODO: remove as FF only
/**
 * Inherits from a given class by setting the prototype
 * 
 * @param   child   Child class
 * @param   base    Base class
 */
export function inherit(child: Function, supertype: Function) {
	child.prototype.__proto__ = supertype.prototype;
}
	
/**
 * Inherits from a given class by setting the prototype
 * 
 * @param   child   Child class
 * @param   base    Base class
 */
export function inheritNew(child: Function, base: Function) {
	var oldProto = child.prototype;
	child.prototype = Object.create(base);
		
	// getting the correct properties
	var propNames = Object.getOwnPropertyNames(oldProto);
	for(var i = 0, len = propNames.length; i < len; ++i)
		Object.defineProperty(child.prototype, propNames[i], Object.getOwnPropertyDescriptor(oldProto, propNames[i]));
}

/**
 * Represents options used for borrowing
 */
export interface IBorrowOptions {
    ownPropsOnly?: bool;
    overwriteExisting?: bool;

	// filters
    usePropFilters?: bool;

    borrowAccessors?: bool;
    borrowFunctions?: bool;
    borrowNonFunctionValues?: bool;
    borrowNonEnumerable?: bool;
    borrowNonConfigurable?: bool;
    borrowNonWritable?: bool;
}

/**
 * Standard options used for borrowing
 */
export var BorrowStdOptions: IBorrowOptions = {
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
};

/**
 * Borrows properties from the given object (useful for Mixins)
 * 
 * @param   to        Object to add properties to
 * @param   from      Object to get properties from
 * @param   options   Options to use for borrowing
 */
export function borrow(to: Object, from: Object, options?: IBorrowOptions) {
	if(!options)
		options = BorrowStdOptions;
		
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
}
	
/**
 * Creates an instance of the given class with arguments given as an array
 *    see http://www.bennadel.com/blog/2291-Invoking-A-Native-JavaScript-Constructor-Using-Call-Or-Apply-.htm
 * 
 * @param   constructorFunc   Constructor function
 * @param   arguments         Array of arguments
 * 
 * @returns Newly created object
 */
export function createInstance(constructorFunc: Function, args: Array): Object {
	// Create an object that extends the target prototype
	var newInstance = Object.create(constructorFunc.prototype);
		
	// Invoke the custom constructor on the new object,
	// passing in any arguments that were provided.
	newInstance = (constructorFunc.apply( newInstance, args ) || newInstance);
		
	// Return the newly created friend.
	return newInstance;
}
	
/**
 * Checks if the given object is an instance of the given constructor function
 *    uses obj._classList internally
 * 
 * @param   obj               Object to check
 * @param   constructorFunc   Constructor function
 *
 * @returns   True if instance of, otherwise false
 */
export function isInstanceOf(obj: Object, constructorFunc: Function): bool {
	if(obj instanceof constructorFunc)
		return true;
		
	if((<any>obj)._classList)
	{
		for(var i = 0, len = (<any>obj)._classList.length; i < len; ++i)
		{
			if(constructorFunc === (<any>obj)._classList[i])
				return true;
		}
	}
		
	return false;
}
	
// TODO: TSBUG: fix Function.name
/**
 * Checks if the given object is an instance of the given constructor function
 *    uses obj._classList internally
 * 
 * @param   obj               Object to check
 * @param   constructorFunc   Constructor function
 *
 * @returns   True if instance of, otherwise false
 */
export function isInstanceOfByString(obj: Object, constructorFunc: Function): bool {
	if(obj instanceof constructorFunc)
        return true;
    else {
	    var proto = Object.getPrototypeOf(obj);
	    if (proto.constructor && proto.constructor.name === (<any>constructorFunc).name)
	        return true;
    }
		
	if((<any>obj)._classList)
	{
		for(var i = 0, len = (<any>obj)._classList.length; i < len; ++i)
		{
			if((<any>constructorFunc).name === (<any>obj)._classList[i].name)
				return true;
		}
	}
		
	return false;
}



