var EXPORTED_SYMBOLS = ["ItemRegistry"];

Components.utils.import("chrome://fibro/content/modules/Utils/Services.jsm");
Components.utils.import("chrome://fibro/content/modules/utils/log.jsm");

var ItemRegistry = {
	
	_constructorFuncsByScheme: {},
	
	/**
	 * Registers the constructor function for an item
	 * 
	 * @param   {string}     scheme            URI scheme
	 * @param   {function}   constructorFunc   Constructor to save
	 */
	registerItemConstructor: function registerItemConstructor(scheme, constructorFunc)
	{
		this._constructorFuncsByScheme[scheme] = constructorFunc;
	},
	
	/**
	 * Returns the constructor function for items of the given scheme
	 * 
	 * @param   {string}   scheme   URI scheme to search for
	 * 
	 * @returns {function}   Constructor function
	 */
	getItemConstructor: function getItemConstructor(scheme)
	{
		return this._constructorFuncsByScheme[scheme];
	},
	
	/* Item, File, etc. */ createItemFromURI: function createItemFromURI(URI)
	{
		return new (this._constructorFuncsByScheme[URI.scheme])(URI);
	},
	
	/* Item, File, etc. */ createItemFromURISpec: function createItemFromURISpec(URIspec)
	{
		return this.createItemFromURI(Services.io.newURI(URIspec, null, null));
	},
	
	
};