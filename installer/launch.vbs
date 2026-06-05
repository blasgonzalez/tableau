Option Explicit

Dim objShell, objFSO, scriptDir, nodeExe, serverJs, dataDir

Set objShell = CreateObject("WScript.Shell")
Set objFSO   = CreateObject("Scripting.FileSystemObject")

scriptDir = objFSO.GetParentFolderName(WScript.ScriptFullName)
nodeExe   = scriptDir & "\runtime\node.exe"
serverJs  = scriptDir & "\server.js"
dataDir   = objShell.ExpandEnvironmentStrings("%LOCALAPPDATA%") & "\Tableau\data"

Dim parentDir
parentDir = objFSO.GetParentFolderName(dataDir)
If Not objFSO.FolderExists(parentDir) Then
    objFSO.CreateFolder parentDir
End If
If Not objFSO.FolderExists(dataDir) Then
    objFSO.CreateFolder dataDir
End If

objShell.Environment("PROCESS")("TABLEAU_DATA_DIR") = dataDir
objShell.Environment("PROCESS")("TABLEAU_UPDATE_URL") = _
    "https://raw.githubusercontent.com/blasgonzalez/tableau/main/installer/version.json"

' Comprobar si el servidor ya esta en marcha (ambas condiciones en la misma linea)
Dim oExec, netOut, lines, alreadyRunning, idx
Set oExec = objShell.Exec("netstat -aon")
netOut = oExec.StdOut.ReadAll()
Set oExec = Nothing

alreadyRunning = False
lines = Split(netOut, vbCrLf)
For idx = 0 To UBound(lines)
    If InStr(lines(idx), ":3000 ") > 0 And InStr(lines(idx), "LISTENING") > 0 Then
        alreadyRunning = True
        Exit For
    End If
Next

If alreadyRunning Then
    objShell.Run "http://localhost:3000", 1, False
Else
    ' Arrancar servidor Node (oculto)
    objShell.Run """" & nodeExe & """ """ & serverJs & """", 0, False

    ' PowerShell en background: espera hasta que el servidor responda y abre el navegador
    Dim psCmd
    psCmd = "powershell -WindowStyle Hidden -NoProfile -Command """ & _
        "for($i=0;$i-lt30;$i++){try{" & _
        "Invoke-WebRequest 'http://localhost:3000' -TimeoutSec 1 -UseBasicParsing -ErrorAction Stop|Out-Null;break" & _
        "}catch{Start-Sleep 1}};Start-Process 'http://localhost:3000'" & """"
    objShell.Run psCmd, 0, False
End If
