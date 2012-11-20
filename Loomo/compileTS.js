var exec = require('child_process').exec;

var files = [
	"chrome/content/bindings/itemview/Container.ts",
	"chrome/content/modules/Filesystem/FileOperations_Worker.ts",
	"chrome/content/scripts/protocols/fileview.ts",
	"chrome/content/scripts/filebrowser_startup.ts",
	"components/nsXFileProtocolHandler.ts"
];

// tsc --target es5 components\nsXFileProtocolHandler.ts
var callString = "tsc --target es5 " + files.join(" ");
console.log("> " + callString + "\n");

exec(callString, function (error, stdout, stderror) {
	console.log('%s', stdout);
	console.log('%s', stderror);
});