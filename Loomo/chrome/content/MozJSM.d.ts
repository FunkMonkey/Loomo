///<reference path='MozGlobals.d.ts' />

declare module Services {
	export var io: Components.interfaces.nsIIOService;
	export var wm: Components.interfaces.nsIWindowMediator;
}

declare module XPCOMUtils {
	export function generateQI(interfaces: any[]);
	export function generateNSGetFactory(func: any[]);
}