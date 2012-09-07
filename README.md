#Loomo

Loomo is a filebrowser extension for Mozilla Firefox.

[[Loomo/wiki/images/loomo.jpg]]

It implements the `xfile` protocol, with which it is possible to browse the local filesystem from within the Firefox tabs. 

Using the `xfile` URL scheme makes it possible to bookmark and tag files and directories. The awesomebar can be used to open directories from the history. All Firefox extensions that enhance bookmarking and the-like can now be used for file-system related access!

File operations will be implemented using the native dialogs. COM will be used for Windows using js-ctypes.

## Loomo Classic

There is a very old version of Loomo, [Loomo Classic](Loomo/wiki/Loomo-Classic), which was reimplemented and open-sourced here in this repository on github. The old Loomo was heavily based on XPCOM and hard to maintain. Loomo Classic had many more features, which will be re-integrated into the new version step by step.

Here is what it looked like:

[[Loomo/wiki/images/loomo_classic.jpg]]
