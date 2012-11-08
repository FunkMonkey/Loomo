///<reference path='../../Worker.d.ts' />


var foo = " mool ";
importScripts("../Utils/COM/COM.jsm");
importScripts("../Utils/COM/IShellItem.jsm");
importScripts("../Utils/COM/IFileOperation.jsm");

declare var IFileOperationModule;

<any>IFileOperationModule.initialize();

self.onmessage = function(event) {
	
	switch(event.data.operation)
	{
		case "copy":
			IFileOperationModule.copyItem(event.data.sourceFile, event.data.destinationDir, event.data.newName);
			break;
	}
	
	
	self.postMessage("" + "file copied");  
};  