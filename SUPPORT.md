# Tableau — Support Knowledge Base

## Issue: "Cannot connect to server at localhost:3000"

**Symptom:** User double-clicks the desktop icon and the browser shows a connection error.

**Root cause:** The browser opened before the server was ready, or the server failed to start entirely.

### Solutions (in order of likelihood)

1. **Wait and refresh** — The server may still be starting up. Wait 10–15 seconds and press F5. This is the most common cause.

2. **CMD window closed immediately** — The black Command Prompt window must stay open while Tableau is running. If it flashes and disappears, something blocked the startup. Ask the user to run `launch.bat` manually from `C:\Users\<name>\AppData\Local\Programs\Tableau` and share a screenshot of the error.

3. **Antivirus / Windows Defender** — The bundled `node.exe` may have been quarantined. Check: Windows Security → Protection history.

4. **Windows SmartScreen** — Try right-clicking `launch.bat` → Run as administrator.

5. **Firewall blocking port 3000** — Check Windows Defender Firewall for a rule blocking `node.exe`. May have been triggered by a dismissed security prompt during first launch.

**Diagnostic ask:** If steps 1–2 don't resolve it, ask for a screenshot of the CMD window after running `launch.bat` manually.
