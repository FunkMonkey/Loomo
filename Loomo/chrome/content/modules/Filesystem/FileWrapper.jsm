

/**
 * Wraps around nsIFile and OS.File
 */
function FileWrapper(pathURIFile)
{
	this.path = "";
	this.URIspec = "";

	if(pathURIFile === undefined) {
		throw new Error("Constructor needs exactly one parameter that can be a nsIFile or nsIURI or a string representing a URI spec or native path!");
	} else if(typeof pathURIFile === "string") {
		
		if(pathURIFile.startsWith("file://")){

		} else {

		}

	} else if(pathURIFile instanceof Components.interfaces.nsIFile) {
	} else if(pathURIFile instanceof Components.interfaces.nsIURI) {
	} else {
		throw new Error("Constructor needs exactly one parameter that can be a nsIFile or nsIURI or a string representing a URI spec or native path!");
	}
}

FileWrapper.prototype = { 
	
};

Object.defineProperty(FileWrapper.prototype, "constructor", {value: FileWrapper});