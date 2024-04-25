# Virtual file system

## Function

~~1. `cd FOLDER_PATH`: change current working directory/folder to the specified `FOLDER`~~
~~2. `cr [-p] PATH [DATA]`: create a new file (if `DATA` is specified, otherwise create a new folder) at the specified `PATH`~~
   ~~1. if the parent folder of the destination `PATH` does not exist:~~
      ~~1. **Bonus feature:** if optional param `-p` is specified, create the missing parent folders~~
        ~~2. else, raise error~~
    ~~2. if there is an existing file/folder at `PATH`, raise error~~
~~3. `cat FILE_PATH`: show the content of a file at `FILE_PATH`. If there is no file at `FILE_PATH`, raise error.~~
~~4. `ls [FOLDER_PATH]`: list out all items **directly under** a folder~~
    ~~1. the output list must include name, created_at, and size of each item **directly under** the current folder, and of the current folder itself. Size of a folder is the total size of all files within the folder. Size of a file is the number of characters in its data.~~
        ~~1. if the optional param `FOLDER_PATH` is specified, list items in the folder at `FOLDER_PATH`. Otherwise if omitted, list items in the current working folder~~
5. `find NAME [FOLDER_PATH]`: search all files/folders whose name **contains** the substring `NAME`. If the optional param `FOLDER_PATH` is specified, find in the folder at `FOLDER_PATH`. Otherwise if omitted, find in the current working folder. Note:
    1. the command should find in subfolders as well
    2. the result should be displayed nicely to end users
~~6. `up PATH NAME [DATA]` update the file/folder at `PATH` to have new `NAME` and, optionally, new `DATA`~~
7. `mv PATH FOLDER_PATH` move a file/folder at `PATH` **into** the destination `FOLDER_PATH`. Raise error if:
    1. there is no Folder at `FOLDER_PATH`
    2. `FOLDER_PATH` is sub-path of `PATH`. In other words, cannot move a folder to become a subfolder of itself
~~8. `rm PATH [PATH2 PATH3...]`: remove files/folders at the specified `PATH`(s)~~
