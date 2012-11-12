// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================

import Extension = module("Utils/Extension");
import MItem = module("Item");


// TODO: extend Array, once it is not an interface anymore in lib.d.ts
/**
 * Represents a group of items
 */
export class Group {

	/**
	 * Context this group was created from
	 */
    contextItem: MItem.Item;

    // TODO: think about possible parameters
    /**
     * Represents a group of items
     *
     * @constructor
     * @param   item   Context of this Group
     */
    constructor(itemOrURIOrSpec: any) {

        // added to ignore super as first constructor statement
        if(itemOrURIOrSpec === -1)
            return null;

	    this.contextItem = null;
	
	    if(itemOrURIOrSpec === undefined)
		    throw new Error("Constructor needs exactly one parameter that can be an Item or nsIURI or a string representing a URI spec!");
	
	    if(itemOrURIOrSpec instanceof MItem.Item)
	    {
		    this.contextItem = itemOrURIOrSpec;
	    }
	    /*else if(itemOrURIOrSpec instanceof Components.interfaces.nsIURI)
	    {
		    // TODO: use Fibro item registry
		    Cu.import("chrome://fibro/content/scripts/modules/Fibro.jsm");
		    this.contextItem = Fibro.createItemFromURI(itemOrURIOrSpec);	
	    }
	    else if(typeof(itemOrURIOrSpec) === "string")
	    {
		    // TODO: use Fibro item registry
		    Cu.import("chrome://fibro/content/scripts/modules/Fibro.jsm");
		    this.contextItem = Fibro.createItemFromURISpec(itemOrURIOrSpec);	
	    }*/
	    else
		    throw new Error("Unsupported parameter. Please pass an Item or nsIURI or a string representing a URI spec!");
	
    }

    // remove, once Array is not an interface anymore in lib.d.ts
    push(val: MItem.Item) {
        Array.prototype.push.call(this, val);
    }

    // remove, once Array is not an interface anymore in lib.d.ts
    get length(): number {
        throw new Error("Not Implemented");
    }

    // remove, once Array is not an interface anymore in lib.d.ts
    set length(val: number) {
        throw new Error("Not Implemented");
    }

}

// remove, once Array is not an interface anymore in lib.d.ts
delete Group.prototype.length;

// remove, once Array is not an interface anymore in lib.d.ts
Extension.inherit(Group, Array);
