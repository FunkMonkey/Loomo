/*Components.utils.import("resource://filebrowser/identifiers.jsm");
Components.utils.import("resource://filebrowser/Filebrowser.jsm");


//覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧
/// Called, when the page has finished loading
//覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧覧
function setErrorPath()
{
	var pathLabel = document.getElementById("errorPathText");
	pathLabel.value = item.file.path;
}

// setup the onload-handler
window.addEventListener("load", function(e) { setErrorPath(); }, false);

var item = Filebrowser.fileGroupManager.createFileGroupItemFromURISpec(window.location.href);

// as this is just used from the xfile-protocol, we can safely assume the following:
item.QueryInterface(Ci.nsIFileGroupItemFile);

// set the title
document.title = item.getDisplayName();*/

// TODO: fix this file 