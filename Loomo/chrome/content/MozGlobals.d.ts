declare module Components {
	export module utils {
		export function import(path: string, scope?: Object): void;
	}

	export module interfaces {
		// we have to export as class, so they work as types and values at the same time

		export class nsIIDRef {
		}
				
		export class nsISupports {
			// TODO: don't use any
			QueryInterface(interf: any);
		}
		
		export class nsIAppStartup extends nsISupports {
			static eForceQuit;
			static eAttemptQuit;
			quit(severity: bool);
		}

		export class nsIBoxObject extends nsISupports {
			x: number;
			y: number;
			width: number;
			height: number;
		}

		export class nsIChannel extends nsISupports {
		}

		export class nsIConsoleService extends nsISupports {
			logStringMessage(val: string);
		}

		export class nsIFile extends nsISupports {
		}

		export class nsIIOService extends nsISupports {
			getProtocolHandler(scheme: string): nsIProtocolHandler;
			newURI(spec: string, originCharset: string, baseURI: nsIURI): nsIURI;
			newChannelFromURI(uri: nsIURI): nsIChannel;
		}
		
		export class nsIProtocolHandler extends nsISupports {
			static URI_NOAUTH: any;
			static URI_IS_LOCAL_FILE: any;
		}

		export class nsIURI extends nsISupports {
			spec: string;
			scheme: string;
		}

		export class nsIWindowMediator extends nsISupports {
			getMostRecentWindow(name: string): Window;
		}

	}
	export var classes: Array;
	
	export var Constructor: any;
	export var classesByID: any;
	export var results: any;

	export function ID(CID: string);
	
}
interface XULElement extends HTMLElement {
	boxObject: Components.interfaces.nsIBoxObject;
	scrollTop: number;
	scrollBottom: number;
}
/*interface Error {
	stack: any;
}*/

interface Console {
	time(context: string);
	timeEnd(context: string);
}