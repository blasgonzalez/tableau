Option Explicit

Dim objShell, objFSO, scriptDir, nodeExe, serverJs, dataDir, updateUrl

Set objShell = CreateObject("WScript.Shell")
Set objFSO   = CreateObject("Scripting.FileSystemObject")

scriptDir = objFSO.GetParentFolderName(WScript.ScriptFullName)
nodeExe   = scriptDir & "\runtime\node.exe"
serverJs  = scriptDir & "\server.js"
dataDir   = objShell.ExpandEnvironmentStrings("%LOCALAPPDATA%") & "\Tableau\data"
updateUrl = "https://raw.githubusercontent.com/blasgonzalez/tableau/main/installer/version.json"

If Not objFSO.FolderExists(dataDir) Then
    objFSO.CreateFolder dataDir
End If

objShell.Environment("PROCESS")("TABLEAU_DATA_DIR") = dataDir
objShell.Environment("PROCESS")("TABLEAU_UPDATE_URL") = updateUrl

Dim oExec, netOut, alreadyRunning
alreadyRunning = False
Set oExec = objShell.Exec("netstat -aon")
netOut = oExec.StdOut.ReadAll()
If InStr(netOut, ":3000 ") > 0 And InStr(netOut, "LISTENING") > 0 Then
    alreadyRunning = True
End If
Set oExec = Nothing

If alreadyRunning Then
    objShell.Run "http://localhost:3000", 1, False
Else
    objShell.CurrentDirectory = scriptDir
    objShell.Run """" & nodeExe & """ """ & serverJs & """", 0, False

    Dim i, http, ready
    ready = False
    For i = 1 To 30
        WScript.Sleep 1000
        On Error Resume Next
        Set http = CreateObject("MSXML2.XMLHTTP")
        http.Open "GET", "http://localhost:3000", False
        http.Send
        If Err.Number = 0 And http.Status > 0 Then ready = True
        Set http = Nothing
        Err.Clear
        On Error GoTo 0
        If ready Then Exit For
    Next

    objShell.Run "http://localhost:3000", 1, False
End If
