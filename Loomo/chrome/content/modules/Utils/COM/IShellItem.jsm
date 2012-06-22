var EXPORTED_SYMBOLS = ["IShellItemModule"];

Components.utils.import("resource://gre/modules/ctypes.jsm");
Components.utils.import("chrome://fibro/content/modules/Utils/COM/COM.jsm");

var IShellItemModule = {
	
	_initialized: false,
	
	/**
	 * Initializes this module
	 */
	initialize: function initialize()
	{
		if(this._initialized)
			return;
		
		COM.initialize();
		
		const IShellItemVtbl = new ctypes.StructType("IShellItemVtbl");

		const IShellItem = new ctypes.StructType("IShellItem",
			[
			  {
				"lpVtbl": IShellItemVtbl.ptr
			  }
			]);
		
		const IShellItemPtr =  new ctypes.PointerType(IShellItem);
		
		IShellItemVtbl.define(
			[
			  {
				"QueryInterface": ctypes.FunctionType(ctypes.stdcall_abi,
													  COM.HRESULT,
													  [
														IShellItem.ptr,
														COM.REFIID,
														ctypes.voidptr_t
													  ]).ptr
			  },
			  {
				"AddRef": ctypes.FunctionType(ctypes.stdcall_abi,
											  COM.ULONG,
											  [
												IShellItem.ptr
											  ]).ptr
			  },
			  {
				"Release": ctypes.FunctionType(ctypes.stdcall_abi,
											   COM.ULONG,
											   [
												 IShellItem.ptr
											   ]).ptr
			  },
			]);
		
		this.IID_IShellItem = new COM.GUID();
		var hr = COM.CLSIDFromString("{43826d1e-e718-42ee-bc55-a1e261c37bfe}", this.IID_IShellItem.address());
		COM.checkHRESULT(hr, "CLSIDFromString (IID_IShellItem)");
		
		this.IShellItem = IShellItem;
		this.IShellItemPtr = IShellItemPtr;
		this.IShellItemVtbl = IShellItemVtbl;
		
		this._initialized = true;
		
	},
	
	/**
	 * Shuts down this module
	 */
	uninitialize: function uninitialize()
	{
	}, 
};