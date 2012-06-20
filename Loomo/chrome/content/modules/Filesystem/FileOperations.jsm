const EXPORTED_SYMBOLS = ["FileOperations"];

Components.utils.import("resource://gre/modules/ctypes.jsm");
Components.utils.import("chrome://fibro/content/modules/Utils/log.jsm");

// Source:
// http://msdn.microsoft.com/en-us/library/aa383751.aspx
const HWND = ctypes.voidptr_t;
const HRESULT = ctypes.long;
const ULONG = ctypes.unsigned_long;
const WORD = ctypes.unsigned_short;
const DWORD = ctypes.unsigned_long;
const WCHAR = ctypes.jschar;
const LPWSTR = new ctypes.PointerType(WCHAR);
const LPCWSTR = LPWSTR;
const LPOLESTR = LPWSTR;
const LPCOLESTR = LPOLESTR;
const PCWSTR = LPWSTR;
const BOOL = ctypes.int;

// Source:
// http://msdn.microsoft.com/en-us/library/windows/desktop/aa378137%28v=vs.85%29.aspx
const S_OK = 0;
const S_FALSE = 1;

// Source:
// http://msdn.microsoft.com/en-us/library/ff718266%28v=prot.10%29.aspx
const GUID =
        ctypes.StructType("GUID",
              [
                {"Data1": ctypes.unsigned_long},
                {"Data2": ctypes.unsigned_short},
                {"Data3": ctypes.unsigned_short},
                {"Data4": ctypes.char.array(8)}
              ]);
// Source:
// http://msdn.microsoft.com/en-us/library/cc237652%28v=prot.13%29.aspx
const IID = GUID;
// Source:
// http://msdn.microsoft.com/en-us/library/cc237816%28v=prot.13%29.aspx
const REFIID = new ctypes.PointerType(IID);

// Source:
// ???
const CLSID = GUID;
const REFCLSID = new ctypes.PointerType(CLSID);

// =========================================================================

let ole32;
let shell32;
let CoCreateInstance;
let CLSIDFromString;

function checkHRESULT(hr, funcName) {
  if(hr != S_OK) {
    throw "HRESULT " + hr + " returned from function " + funcName;
  }
}

function setupCOM()
{
	
	let CoUninitialize;
	let shouldUninitialize;
	let shellLink;
	let shellLinkPtr;
	let persistFile;
	let persistFilePtr;
	
	
	ole32 = ctypes.open("Ole32");
	shell32 = ctypes.open("Shell32");
	
	CoUninitialize = ole32.declare("CoUninitialize",
								   ctypes.winapi_abi,
								   ctypes.void_t);
	let CoInitializeEx = ole32.declare("CoInitializeEx",
									   ctypes.winapi_abi,
									   HRESULT,
									   ctypes.voidptr_t,
									   DWORD);
	CoCreateInstance = ole32.declare("CoCreateInstance",
										 ctypes.winapi_abi,
										 HRESULT,
										 REFCLSID,
										 ctypes.voidptr_t, // LPUNKNOWN
										 DWORD,
										 REFIID,
										 ctypes.voidptr_t);
	CLSIDFromString = ole32.declare("CLSIDFromString",
										ctypes.winapi_abi,
										HRESULT,
										LPCOLESTR,
										GUID.ptr);

	let hr = CoInitializeEx(null, 0x2); // COINIT_APARTMENTTHREADED
		
	  
	if(S_OK == hr || S_FALSE == hr) {
	  shouldUninitialize = true;
	} else {
	  throw new Error("Unexpected return value from CoInitializeEx: " + hr);
	}

	
}

function shutdownCOM()
{
	if(ole32) {
		try {
		  ole32.close();
		} catch(e) {
		  throw new Error("Failure closing ole32: " + e);
		}
	  }
}
// =========================================================================

setupCOM();

shell32.SHCreateItemFromParsingName = shell32.declare("SHCreateItemFromParsingName",
								   ctypes.winapi_abi,
								   HRESULT,
								   PCWSTR,
								   ctypes.voidptr_t,
								   REFIID,
								   ctypes.voidptr_t
								   );


// =========================================================================

const IShellItemVtbl = new ctypes.StructType("IShellItemVtbl");

const IShellItem = new ctypes.StructType("IShellItem",
    [
      {
        "lpVtbl": IShellItemVtbl.ptr
      }
    ]);

const IShellItemPtr = new ctypes.PointerType(IShellItem);

IShellItemVtbl.define(
    [
      {
        "QueryInterface": ctypes.FunctionType(ctypes.stdcall_abi,
                                              HRESULT,
                                              [
                                                IShellItem.ptr,
                                                REFIID,
                                                ctypes.voidptr_t
                                              ]).ptr
      },
      {
        "AddRef": ctypes.FunctionType(ctypes.stdcall_abi,
                                      ULONG,
                                      [
                                        IShellItem.ptr
                                      ]).ptr
      },
      {
        "Release": ctypes.FunctionType(ctypes.stdcall_abi,
                                       ULONG,
                                       [
                                         IShellItem.ptr
                                       ]).ptr
      },
	]);

// =========================================================================


const IFileOperationVtbl = new ctypes.StructType("IFileOperationVtbl");

const IFileOperation = new ctypes.StructType("IFileOperation",
    [
      {
        "lpVtbl": IFileOperationVtbl.ptr
      }
    ]);

const IFileOperationPtr = new ctypes.PointerType(IFileOperation);

IFileOperationVtbl.define(
    [
      {
        "QueryInterface": ctypes.FunctionType(ctypes.stdcall_abi,
                                              HRESULT,
                                              [
                                                IFileOperation.ptr,
                                                REFIID,
                                                ctypes.voidptr_t
                                              ]).ptr
      },
      {
        "AddRef": ctypes.FunctionType(ctypes.stdcall_abi,
                                      ULONG,
                                      [
                                        IFileOperation.ptr
                                      ]).ptr
      },
      {
        "Release": ctypes.FunctionType(ctypes.stdcall_abi,
                                       ULONG,
                                       [
                                         IFileOperation.ptr
                                       ]).ptr
      },
	  
	  { "Advise": ctypes.voidptr_t },
	  { "Unadvise": ctypes.voidptr_t },
	  { "SetOperationFlags": ctypes.voidptr_t },
	  { "SetProgressMessage": ctypes.voidptr_t },
	  { "SetProgressDialog": ctypes.voidptr_t },
	  { "SetProperties": ctypes.voidptr_t },
	  { "SetOwnerWindow": ctypes.voidptr_t },
	  { "ApplyPropertiesToItem": ctypes.voidptr_t },
	  { "ApplyPropertiesToItems": ctypes.voidptr_t },
	  { "RenameItem": ctypes.voidptr_t },
	  { "RenameItems": ctypes.voidptr_t },
	  { "MoveItem": ctypes.voidptr_t },
	  { "RenameItems": ctypes.voidptr_t },
	  {
        "CopyItem": ctypes.FunctionType(ctypes.stdcall_abi,
                                       HRESULT,
                                       [
                                         IShellItemPtr,
										 IShellItemPtr,
										 LPCWSTR,
										 ctypes.voidptr_t
                                       ]).ptr
      },
	  { "CopyItems": ctypes.voidptr_t },
	  { "DeleteItem": ctypes.voidptr_t },
	  { "DeleteItems": ctypes.voidptr_t },
	  { "NewItem": ctypes.voidptr_t },
	  {
        "PerformOperations": ctypes.FunctionType(ctypes.stdcall_abi,
                                       HRESULT).ptr
      },
	  { "GetAnyOperationsAborted": ctypes.voidptr_t },  
	  
	]);


let CLSID_FileOperation = new GUID();
let IID_IFileOperation = new GUID();

let IID_IShellItem = new GUID();

function testFileOp()
{
	var hr;
	
    hr = CLSIDFromString("{3ad05575-8857-4850-9277-11b85bdb8e09}", CLSID_FileOperation.address());
    checkHRESULT(hr, "CLSIDFromString (CLSID_FileOperation)");
	
	hr = CLSIDFromString("{947aab5f-0a5c-4c13-b4d6-4bf7836fc9f8}", IID_IFileOperation.address());
    checkHRESULT(hr, "CLSIDFromString (IID_IFileOperation)");
	
	hr = CLSIDFromString("{43826d1e-e718-42ee-bc55-a1e261c37bfe}", IID_IShellItem.address());
    checkHRESULT(hr, "CLSIDFromString (IID_IShellItem)");
	
	fileOpPtr = new IFileOperationPtr();
    hr = CoCreateInstance(CLSID_FileOperation.address(),
                          null,
                          0x1, // CLSCTX_INPROC_SERVER
                          IID_IFileOperation.address(),
                          fileOpPtr.address());
	
	checkHRESULT(hr, "CoCreateInstance (fileOpPtr)");
	
	fileToCopy = new IShellItemPtr();
	hr = shell32.SHCreateItemFromParsingName("C:\\Downloads\\Browser\\alternativlos-23.ogg", null, IID_IShellItem.address(), fileToCopy.address());
	checkHRESULT(hr, "SHCreateItemFromParsingName (fileToCopy)");
	
	destination = new IShellItemPtr();
	hr = shell32.SHCreateItemFromParsingName("C:\\Downloads\\Share", null, IID_IShellItem.address(), destination.address());
	checkHRESULT(hr, "SHCreateItemFromParsingName (destination)");
	
	var fileOp = fileOpPtr.contents.lpVtbl.contents;
	
	hr = fileOp.CopyItem(fileToCopy, destination, "newName.ogg", null);
	log("RES " + HRESULT(hr))
	checkHRESULT(hr, "CopyItem");
	
	hr = fileOp.PerformOperations();
	checkHRESULT(hr, "PerformOperations");
}

// =========================================================================

var FileOperations = {
	
};

testFileOp();

