///<reference path='../Moz.d.ts' />

//window.addEventListener("error", function(errorMsg, url, lineNumber){alert(errorMsg + " " + url + ":" + lineNumber)})

/*window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
  alert(errorMsg + " " + url + ":" + lineNumber)

  // Just let default handler run.
  return false;
}*/

var Fibro = {};
Components.utils.import("chrome://fibro/content/modules/Fibro.js", Fibro);




//Components.utils.import("chrome://filebrowser/FileGroupItemMenu.jsm");
//window.addEventListener("load", function(e) { Fibro.onAppStartup(window); }, false); 
//window.addEventListener("close", Fibro.onAppClose, false); 

