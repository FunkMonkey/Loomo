// ==========================================================================
// Boilerplate for hacking support JS modules in TypeScript
///<reference path='../../Moz.d.ts' />
Components.utils.import("chrome://fibro/content/modules/Utils/CommonJS.jsm");
initCommonJSModule(eval('this'));
// ==========================================================================

export interface IContainerElement extends Element {
    impl: Container;
}

/**
 * Represents a container for views
 */
export class Container {

    node: IContainerElement;

    /**
     * Represents a container for views
     *
     * @constructor
     * @param   {element}   node   The connected DOM element
     */
    constructor(node: IContainerElement) {
        this.node = node;
    }
}

export declare function initFoo(global: any): void;