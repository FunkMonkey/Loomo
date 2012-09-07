#Loomo

**INFO:** Development is currently mostly paused until Mozilla's new faster asynchronous file IO, [OS.File](https://developer.mozilla.org/en-US/docs/JavaScript_OS.File), is implemented to a certain degree. Currently waiting for OS.File to be usable from main-thread (using IO workers) tracked by the bugs [729057](https://bugzilla.mozilla.org/show_bug.cgi?id=729057) and [777711](https://bugzilla.mozilla.org/show_bug.cgi?id=777711). Shouldn't be too long though ...

Loomo is a filebrowser extension for Mozilla Firefox.

![Loomo screenshot](https://raw.github.com/wiki/FunkMonkey/Loomo/images/loomo.jpg)

It implements the `xfile` protocol, with which it is possible to browse the local filesystem from within the Firefox tabs. 

Using the `xfile` URL scheme makes it possible to bookmark and tag files and directories. The awesomebar can be used to open directories from the history. All Firefox extensions that enhance bookmarking and the-like can now be used for file-system related access!

File operations will be implemented using the native dialogs. COM will be used for Windows using js-ctypes.

## Loomo Classic

There is a very old version of Loomo, [Loomo Classic](Loomo/wiki/Loomo-Classic), which was reimplemented and open-sourced here in this repository on github. The old Loomo was heavily based on XPCOM and hard to maintain. Loomo Classic had many more features, which will be re-integrated into the new version step by step.

Here is what it looked like:

![Loomo Classic screenshot](https://raw.github.com/wiki/FunkMonkey/Loomo/images/loomo_classic.jpg)
