const EXPORTED_SYMBOLS = ["FileOperations"];

var LogUtils = {};
Components.utils.import("chrome://fibro/content/modules/Utils/log.js", LogUtils);

//Components.utils.import("chrome://fibro/content/modules/Utils/COM/IFileOperation.jsm");
//IFileOperationModule.initialize();
//IFileOperationModule.copyItem("C:\\Downloads\\Share\\Chronicle (2012).avi", "C:\\Downloads\\Share\\_Unsorted");


var worker = null;




// TODO: edit per platform
var FileOperations = {
	
	/**
	 * Returns an idle worker
	 * 
	 * @returns {Worker}   Description
	 */
	getIdleWorker: function getIdleWorker() {
		if(!worker) {
			worker = new ChromeWorker("FileOperations_Worker.js");  
			worker.onmessage = function(event) {  
				LogUtils.log("Message from worker: " + event.data);  
			};
		}
		
		return worker;
	}, 
	
	
	/**
	 * Copies the given file
	 * 
	 * @param   {LocalFile}   sourceFilename   Source file to copy
	 * @param   {LocalFile}   destination      Destination folder to copy to
	 * @param   {string}      [newName]        New name
	 */
	copyItem: function copyItem(sourceFile, destinationDir, newName) {
		var worker = this.getIdleWorker();
		
		// TODO: use osFile instead of xpcom
		worker.postMessage({operation: "copy", sourceFile: sourceFile.xpcomFile.path, destinationDir: destinationDir.xpcomFile.path, newName: newName}); // start the worker.
	}
};