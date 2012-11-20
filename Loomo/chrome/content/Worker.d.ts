declare interface Window {
	postMessage(message: any, targetOrigin?: string, ports?: any): void;
}
