const EXPORTED_SYMBOLS = ["FileOperations"];

Components.utils.import("resource://gre/modules/ctypes.jsm");

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
const BOOL = ctypes.int;

// Source:
// http://msdn.microsoft.com/en-us/library/windows/desktop/aa378137%28v=vs.85%29.aspx
const S_OK = new HRESULT(0);
const S_FALSE = new HRESULT(1);

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
let CoCreateInstance;

function setupCOM()
{
	
	let CoUninitialize;
	let shouldUninitialize;
	let shellLink;
	let shellLinkPtr;
	let persistFile;
	let persistFilePtr;
	//try {
	  ole32 = ctypes.open("Ole32");
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
	  let CLSIDFromString = ole32.declare("CLSIDFromString",
										  ctypes.winapi_abi,
										  HRESULT,
										  LPCOLESTR,
										  GUID.ptr);
	
	  let hr = HRESULT(CoInitializeEx(null,
									  0x2)); // COINIT_APARTMENTTHREADED
	  if(S_OK.toString() == hr.toString()
	  || S_FALSE.toString() == hr.toString()) {
		shouldUninitialize = true;
	  } else {
		throw new Error("Unexpected return value from CoInitializeEx: " + hr);
	  }
	//}
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


const IFileOperationVtbl = new ctypes.StructType("IFileOperationWVtbl");

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
	]);

// =========================================================================

var FileOperations = {
	
};

setupCOM();

