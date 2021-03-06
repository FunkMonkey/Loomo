#Loomo

Loomo is a filebrowser extension for Mozilla Firefox.

### Update 23.12.2013

Loomo development has been on hold for quite a while. I plan a rewrite, but I am waiting for better web-components, native JS modules support and especially some progress on multi-process Firefox as this will heavily impact Loomo. 

### Info

![Loomo screenshot](https://raw.github.com/wiki/FunkMonkey/Loomo/images/loomo.jpg)

It implements the `xfile` protocol, which allows browsing the local filesystem from within the Firefox tabs. 

Using the `xfile` URL scheme makes it possible to bookmark and tag files and directories. The "awesomebar" can be used to open directories from the history. All Firefox extensions that enhance bookmarking and the-like can now be used for file-system related access!

[Download the newest version](https://github.com/FunkMonkey/Loomo/downloads) and try it (copy the URL into address bar): 

* Unix: xfile:///home/
* Windows: xfile:///c:/Windows/

### Current Status

* Browsing the filesystem

### Coming next

* file selection
* file operations (copy, move, paste, rename)
 * File operations will be implemented using the native dialogs. COM will be used for Windows using js-ctypes.

## Loomo Classic

There is a very old version of Loomo, [Loomo Classic](Loomo/wiki/Loomo-Classic), which was reimplemented and open-sourced here in this repository on github. The old Loomo was heavily based on XPCOM and hard to maintain. Loomo Classic had many more features, which will be re-integrated into the new version step by step.

Here is what it looked like:

![Loomo Classic screenshot](https://raw.github.com/wiki/FunkMonkey/Loomo/images/loomo_classic.jpg)
