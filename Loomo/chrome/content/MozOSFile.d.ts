///<reference path='MozPromise.d.ts' />

declare module OS {
	export var Win;

	export interface IInfo {
		isDir: bool;
		isSymLink: bool;
	}

	export interface IDirectoryEntry {
		path: string;
		isDir: bool;
		isSymLink: bool;
		name: string;
	}

	export interface IDirectoryIterator {
		forEach(cb: (entry: IDirectoryEntry, index: number) => any): IPromiseDirectoryEntry;
		close();
	}

	
	export class File {
		static stat(path: string): Promise.IPromise;
		static DirectoryIterator: {
			new (string): IDirectoryIterator;
		};
		static Info: {
			new (): IInfo;
		};
	}

	export module Constants {
		export var Win;
	}

	export class Path {
		static basename(path: string): string;
		static dirname(path: string): string;
		static normalize(path: string): string;
	}

	export interface IPromiseInfo extends Promise.IPromise {
		then(onSuccess: (val: IInfo) => any, onFail?: Function): Promise.IPromise;
	}

	export interface IPromiseDirectoryEntry extends Promise.IPromise {
		then(onSuccess: (val: IDirectoryEntry) => any, onFail?: Function): Promise.IPromise;
	}
}

/*interface Error {
	stack: any;
}*/