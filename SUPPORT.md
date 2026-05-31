# Tableau — Support Knowledge Base

## Windows: "Cannot connect to server at localhost:3000"

**Symptom:** User double-clicks the desktop icon and the browser shows a connection error.

**Root cause:** The browser opened before the server was ready, or the server failed to start entirely.

### Solutions (in order of likelihood)

1. **Wait and refresh** — The server may still be starting up. Wait 10–15 seconds and press F5. This is the most common cause.

2. **Antivirus / Windows Defender** — The bundled `node.exe` may have been quarantined. Check: Windows Security → Protection history.

3. **Windows SmartScreen** — On first launch SmartScreen may block the app. Click "More info" → "Run anyway". If the installer was blocked, re-download and run as administrator.

4. **Firewall blocking port 3000** — Check Windows Defender Firewall for a rule blocking `node.exe`. May have been triggered by a dismissed security prompt during first launch.

**Diagnostic ask:** Ask the user to open Task Manager and check whether `node.exe` appears in the process list after double-clicking the icon.

---

## Mac: "La aplicación no puede abrirse" / Gatekeeper block

**Symptom:** macOS shows "Tableau no puede abrirse porque Apple no puede comprobar si contiene software malicioso."

**Root cause:** The app is not signed with an Apple Developer certificate (normal for free software distributed outside the App Store).

### Solution (one-time, first launch only)

1. In Finder → Applications, **right-click** Tableau → **Open**
2. Click **Open** in the warning dialog

After this, double-click works normally.

**Alternative:** System Settings → Privacy & Security → scroll down → click **"Open Anyway"** (appears a few seconds after the first blocked attempt).

---

## Mac: El servidor no arranca / el navegador no abre

**Symptom:** Double-clicking Tableau does nothing, or the browser opens but shows a connection error.

### Solutions

1. **Wrong DMG for your Mac** — Verify you downloaded the right package:
   - Apple menu → **About This Mac**: "Apple M..." = use `tableau-mac-x.x.x.dmg`; "Intel" = use `tableau-mac-intel-x.x.x.dmg`

2. **App not copied to Applications** — The app must be dragged from the DMG to the Applications folder before launching. Running it directly from the DMG can cause issues.

3. **Port 3000 already in use** — Another process may be using port 3000. Open Terminal and run:
   ```
   lsof -i :3000
   ```
   Kill the process shown, then relaunch Tableau.

4. **Permission issue on first run** — Open Terminal, run:
   ```
   xattr -cr /Applications/Tableau.app
   ```
   Then try launching again.
