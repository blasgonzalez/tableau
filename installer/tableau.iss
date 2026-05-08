; ═══════════════════════════════════════════════════════════════════════════════
;  Tableau — Script de instalación Inno Setup
;  https://jrsoftware.org/isinfo.php
;
;  ANTES DE COMPILAR:
;    1. Ejecuta installer\build.bat para descargar node.exe y preparar node_modules
;    2. Ajusta MyAppPublisher y MyAppURL abajo
;    3. NO cambies el AppId una vez distribuido (identifica el programa en Windows)
; ═══════════════════════════════════════════════════════════════════════════════

#define MyAppName      "Tableau"
#define MyAppVersion   "1.2.1"
#define MyAppPublisher "Blas González"
#define MyAppURL       "https://github.com/blasgonzalez/tableau"

[Setup]
; !! No cambiar AppId después de la primera distribución !!
AppId={{8B2C4F9A-1D3E-4F7B-A8C2-5E6D9F0B1C3D}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}

; Instala en %LOCALAPPDATA%\Programs\Tableau sin necesitar administrador
DefaultDirName={localappdata}\Programs\{#MyAppName}
DefaultGroupName={#MyAppName}
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog

AllowNoIcons=yes
SourceDir={#SourcePath}\..
OutputDir={#SourcePath}\..\dist
OutputBaseFilename=tableau-installer-{#MyAppVersion}
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern

; Idioma por defecto según el sistema
ShowLanguageDialog=auto

[Languages]
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
; Node.js portátil (descargado por build.bat)
Source: "installer\node.exe";          DestDir: "{app}\runtime";      Flags: ignoreversion

; Aplicación principal
Source: "server.js";                   DestDir: "{app}";              Flags: ignoreversion
Source: "package.json";                DestDir: "{app}";              Flags: ignoreversion
Source: "public\*";                    DestDir: "{app}\public";       Flags: ignoreversion recursesubdirs createallsubdirs
Source: "node_modules\*";              DestDir: "{app}\node_modules"; Flags: ignoreversion recursesubdirs createallsubdirs

; Launcher
Source: "installer\launch.bat";        DestDir: "{app}";              Flags: ignoreversion

[Icons]
; Acceso directo en el menú inicio
Name: "{group}\{#MyAppName}";                          Filename: "{app}\launch.bat"; WorkingDir: "{app}"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}";    Filename: "{uninstallexe}"

; Acceso directo en el escritorio (opcional)
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\launch.bat"; WorkingDir: "{app}"; Tasks: desktopicon

[Run]
; Ofrecer abrir la app al terminar la instalación
Filename: "{app}\launch.bat"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; \
  WorkingDir: "{app}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
; Elimina solo los archivos del programa; los datos del usuario en %LOCALAPPDATA%\Tableau\data quedan intactos
Type: filesandordirs; Name: "{app}"
