var loadedByWorker = (typeof importScripts === "function");

if(!loadedByWorker)
{
	var EXPORTED_SYMBOLS = ["IFileOperationModule"];
	
	Components.utils.import("resource://gre/modules/ctypes.jsm");
	Components.utils.import("chrome://fibro/content/modules/Utils/COM/COM.jsm");
	Components.utils.import("chrome://fibro/content/modules/Utils/COM/IShellItem.jsm");
}

var IFileOperationModule = {
	
	_initialized: false,
	
	/**
	 * Initializes this module
	 */
	initialize: function initialize()
	{
		if(this._initialized)
			return;
		
		IShellItemModule.initialize();
		
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
													  COM.HRESULT,
													  [
														IFileOperation.ptr,
														COM.REFIID,
														ctypes.voidptr_t
													  ]).ptr
			  },
			  {
				"AddRef": ctypes.FunctionType(ctypes.stdcall_abi,
											  COM.ULONG,
											  [
												IFileOperation.ptr
											  ]).ptr
			  },
			  {
				"Release": ctypes.FunctionType(ctypes.stdcall_abi,
											   COM.ULONG,
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
			  { "MoveItems": ctypes.voidptr_t },
			  {
				"CopyItem": ctypes.FunctionType(ctypes.stdcall_abi,
											   COM.HRESULT,
											   [
												 IFileOperation.ptr,
												 IShellItemModule.IShellItemPtr,
												 IShellItemModule.IShellItemPtr,
												 COM.LPCWSTR,
												 ctypes.voidptr_t
											   ]).ptr
			  },
			  { "CopyItems": ctypes.voidptr_t },
			  { "DeleteItem": ctypes.voidptr_t },
			  { "DeleteItems": ctypes.voidptr_t },
			  { "NewItem": ctypes.voidptr_t },
			  {
				"PerformOperations": ctypes.FunctionType(ctypes.stdcall_abi,
														 COM.HRESULT,
														 [IFileOperation.ptr]).ptr
			  },
			  { "GetAnyOperationsAborted": ctypes.voidptr_t },  
			  
			]);
		
		this.IFileOperation = IFileOperation;
		this.IFileOperationPtr = IFileOperationPtr;
		this.IFileOperationVtbl = IFileOperationVtbl;
		
		var hr;
		
		this.CLSID_FileOperation = new COM.GUID();
		hr = COM.CLSIDFromString("{3ad05575-8857-4850-9277-11b85bdb8e09}", this.CLSID_FileOperation.address());
		COM.checkHRESULT(hr, "CLSIDFromString (CLSID_FileOperation)");
		
		this.IID_IFileOperation = new COM.GUID();
		hr = COM.CLSIDFromString("{947aab5f-0a5c-4c13-b4d6-4bf7836fc9f8}", this.IID_IFileOperation.address());
		COM.checkHRESULT(hr, "CLSIDFromString (IID_IFileOperation)");
		
		
		this._initialized = true;
		
	},
	
	/**
	 * Shuts down this module
	 */
	uninitialize: function uninitialize()
	{
	},
	
	/**
	 * Copies the given file
	 * 
	 * @param   {string}   sourceFilename   Source file to copy
	 * @param   {string}   destination      Destination folder to copy to
	 * @param   {string}   [newName]        New name
	 */
	copyItem: function copyItem(sourceFilename, destination, newName)
	{
		var fileOpPtr = new this.IFileOperationPtr();
		var hr = COM.CoCreateInstance(this.CLSID_FileOperation.address(),
							  null,
							  0x1 | 0x2 | 0x4 | 0x10, // CLSCTX_INPROC_SERVER
							  this.IID_IFileOperation.address(),
							  fileOpPtr.address());
		
		COM.checkHRESULT(hr, "CoCreateInstance (fileOpPtr)");
		
		var fileToCopy = new IShellItemModule.IShellItemPtr();
		hr = COM.shell32.SHCreateItemFromParsingName(sourceFilename, null, IShellItemModule.IID_IShellItem.address(), fileToCopy.address());
		COM.checkHRESULT(hr, "SHCreateItemFromParsingName (fileToCopy)");
		
		var dest = new IShellItemModule.IShellItemPtr();
		hr = COM.shell32.SHCreateItemFromParsingName(destination, null, IShellItemModule.IID_IShellItem.address(), dest.address());
		COM.checkHRESULT(hr, "SHCreateItemFromParsingName (destination)");
		
		var fileOp = fileOpPtr.contents.lpVtbl.contents;
		hr = fileOp.CopyItem(fileOpPtr, fileToCopy, dest, (newName == null) ? null : newName, null);
		COM.checkHRESULT(hr, "CopyItem");
		
		hr = fileOp.PerformOperations(fileOpPtr);
		COM.checkHRESULT(hr, "PerformOperations");
		
		hr = fileToCopy.contents.lpVtbl.Release(fileToCopy);
		COM.checkHRESULT(hr, "Release fileToCopy");
		
		hr = dest.contents.lpVtbl.Release(dest);
		COM.checkHRESULT(hr, "Release dest");
		
		hr = fileOp.Release(fileOpPtr);
		COM.checkHRESULT(hr, "Release FileOperation");
	}, 
	
};