// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================
	
	

/**
 * Returns the anonymous node of the given element with the given id
 * 
 * @param   elem     Element to search through
 * @param   anonID   Id to find
 * 
 * @returns   Found anonymous node
 */
// TODO: update types
export function getAnonNode(elem, anonID: string) {
	return elem.ownerDocument.getAnonymousElementByAttribute(elem, "anonid", anonID);
}
	
/**
 * Returns the parent node with the given local name
 * 
 * @param   elem        Given node to find parent for
 * @param   localName   Local name
 * 
 * @returns    Parent node with local name
 */
export function getParentNodeByLocalName(elem: Element, localName: string): Node {
	var parent = elem.parentNode;
	while (parent) {
		if (parent.localName === localName)
			return parent;
			
		parent = parent.parentNode;
	}
	return null; 
}