///<reference path='MozGlobals.d.ts' />
///<reference path='MozJSM.d.ts' />

declare function initCommonJSModule(global: any): void;
declare function getRequireForContentScript(doc: any): (path: string) => Object;
