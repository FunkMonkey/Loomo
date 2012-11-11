// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================

/**
 * Represents the DOM element that holds a reference to a Container
 */
export interface IContainerElement extends XULElement {

    /**
     * References the connected Container
     */
    impl: Container;
}

/**
 * Represents a container for views
 */
export class Container {

    /**
     * References the connected DOM element
     */
    node: IContainerElement;

    /**
     * Represents a container for views
     *
     * @constructor
     * @param   node   The connected DOM element
     */
    constructor(node: IContainerElement) {
        this.node = node;
    }
}