var EXPORTED_SYMBOLS = ["COM"];

Components.utils.import("resource://gre/modules/ctypes.jsm");


var jscharPtr = new ctypes.PointerType(ctypes.jschar);
var GUID = ctypes.StructType("GUID",
				  [
					{"Data1": ctypes.unsigned_long},
					{"Data2": ctypes.unsigned_short},
					{"Data3": ctypes.unsigned_short},
					{"Data4": ctypes.char.array(8)}
				  ]);

var COM = {
	
	// Source:
	// http://msdn.microsoft.com/en-us/library/aa383751.aspx
	HWND: ctypes.voidptr_t,
	HRESULT: ctypes.long,
	ULONG: ctypes.unsigned_long,
	WORD: ctypes.unsigned_short,
	DWORD: ctypes.unsigned_long,
	WCHAR: ctypes.jschar,
	LPWSTR: jscharPtr,
	LPCWSTR: jscharPtr,
	LPOLESTR: jscharPtr,
	LPCOLESTR: jscharPtr,
	PCWSTR: jscharPtr,
	BOOL: ctypes.int,
	
	// Source:
	// http://msdn.microsoft.com/en-us/library/windows/desktop/aa378137%28v=vs.85%29.aspx
	S_OK: 0,
	S_FALSE: 1,
	
	// Source:
	// http://msdn.microsoft.com/en-us/library/ff718266%28v=prot.10%29.aspx
	GUID: GUID,
			
	// Source:
	// http://msdn.microsoft.com/en-us/library/cc237652%28v=prot.13%29.aspx
	IID: GUID,
	// Source:
	// http://msdn.microsoft.com/en-us/library/cc237816%28v=prot.13%29.aspx
	REFIID: new ctypes.PointerType(GUID),
	
	// Source:
	// ???
	CLSID: GUID,
	REFCLSID: new ctypes.PointerType(GUID),
	
	decimalToHexString: function decimalToHexString(number)
	{
		if (number < 0)
		{
			number = 0xFFFFFFFF + number + 1;
		}
	
		return number.toString(16).toUpperCase();
	},
	
	checkHRESULT: function checkHRESULT(hr, funcName) {
		if(hr != this.S_OK) {
			throw "HRESULT " + hr + " (0x" + this.decimalToHexString(parseInt(hr.toString())) + ")" + " returned from function " + funcName;
		}
	},
	
	
	_initialized: false,
	
	/**
	 * Initializes COM
	 */
	initialize: function initialize()
	{
		if(this._initialized)
			return;
		
		this.ole32 = ctypes.open("Ole32");
		
		this.CoUninitialize = this.ole32.declare("CoUninitialize",
									        ctypes.winapi_abi,
									        ctypes.void_t);
		let CoInitializeEx = this.ole32.declare("CoInitializeEx",
										        ctypes.winapi_abi,
										        this.HRESULT,
										        ctypes.voidptr_t,
										        this.DWORD);
		this.CoCreateInstance = this.ole32.declare("CoCreateInstance",
											       ctypes.winapi_abi,
											       this.HRESULT,
											       this.REFCLSID,
											       ctypes.voidptr_t, // LPUNKNOWN
											       this.DWORD,
											       this.REFIID,
											       ctypes.voidptr_t);
		this.CLSIDFromString = this.ole32.declare("CLSIDFromString",
											      ctypes.winapi_abi,
											      this.HRESULT,
											      this.LPCOLESTR,
											      this.GUID.ptr);
	
		let hr = CoInitializeEx(null, 0x2); // COINIT_APARTMENTTHREADED
			
		  
		if(this.S_OK == hr || this.S_FALSE == hr)
		{
			this._initialized = true;
		}
		else
		{
			throw new Error("Unexpected return value from CoInitializeEx: " + hr);
		}
		
		// shell32
		this.shell32 = ctypes.open("Shell32");
		this.shell32.SHCreateItemFromParsingName = this.shell32.declare("SHCreateItemFromParsingName",
															              ctypes.winapi_abi,
															              this.HRESULT,
															              this.PCWSTR,
															              ctypes.voidptr_t,
															              this.REFIID,
															              ctypes.voidptr_t
															              );
	},
	
	/**
	 * Shuts down COM
	 */
	uninitialize: function uninitialize()
	{
		if(this.ole32) {
			try {
				// TODO: unitizialize
				this.ole32.close();
			} catch(e) {
				throw new Error("Failure closing ole32: " + e);
			}
		}
		
		if(this.shell32) {
			try {
				// TODO: unitizialize
				this.shell32.close();
			} catch(e) {
				throw new Error("Failure closing shell32: " + e);
			}
		}
	}, 
	
	
	
	
}