#Loomo

Loomo is a filebrowser extension for Mozilla Firefox.

![Loomo screenshot](https://raw.github.com/wiki/FunkMonkey/Loomo/images/loomo.jpg)

It implements the `xfile` protocol, which allows browsing the local filesystem from within the Firefox tabs. 

Using the `xfile` URL scheme makes it possible to bookmark and tag files and directories. The "awesomebar" can be used to open directories from the history. All Firefox extensions that enhance bookmarking and the-like can now be used for file-system related access!

Try it: 

* Unix: [xfile:///home/](xfile:///home/)
* Windows: [xfile:///c:/Windows/](xfile:///c:/Windows/)

### Current Status

* Browsing the filesystem

### Coming next

* file selection
* file operations
* * File operations will be implemented using the native dialogs. COM will be used for Windows using js-ctypes.

## Loomo Classic

There is a very old version of Loomo, [Loomo Classic](Loomo/wiki/Loomo-Classic), which was reimplemented and open-sourced here in this repository on github. The old Loomo was heavily based on XPCOM and hard to maintain. Loomo Classic had many more features, which will be re-integrated into the new version step by step.

Here is what it looked like:

![Loomo Classic screenshot](https://raw.github.com/wiki/FunkMonkey/Loomo/images/loomo_classic.jpg)
