/* Playground JS */

document.addEventListener('DOMContentLoaded', () => {
    const htmlInput = document.getElementById('html-code');
    const cssInput = document.getElementById('css-code');
    const jsInput = document.getElementById('js-code');
    const previewIframe = document.getElementById('preview-iframe');
    const runBtn = document.getElementById('run-btn');
    const tabBtns = document.querySelectorAll('.editor-tab');
    const codeInputs = document.querySelectorAll('.code-input');

    // Default code
    htmlInput.value = `<h1>Hello CodeMaster!</h1>
<p>Start coding to see magic happen...</p>
<button id="click-me">Click Me</button>`;

    cssInput.value = `body {
  font-family: sans-serif;
  text-align: center;
  padding-top: 50px;
  background: #f0f4f8;
}
h1 { color: #6366f1; }
button {
  padding: 10px 20px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}`;

    jsInput.value = `document.getElementById('click-me').addEventListener('click', () => {
  alert('You clicked the button!');
  console.log('Button clicked at: ' + new Date().toLocaleTimeString());
});`;

    const consoleOutput = document.getElementById('console-output');

    function logToConsole(msg, type = 'info') {
        const span = document.createElement('span');
        span.className = type === 'error' ? 'error-msg' : 'log-msg';
        span.style.display = 'block';
        span.style.marginBottom = '5px';
        span.style.color = type === 'error' ? '#ef4444' : '#94a3b8';
        span.textContent = `> ${msg}`;
        consoleOutput.appendChild(span);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    let externalWindow = null;
    let currentBlobUrl = null;

    // Helper to generate pure code without console hooks
    function getPureCode() {
        const html = htmlInput.value;
        const css = `<style>\n${cssInput.value}\n</style>`;
        const js = `<script>\n${jsInput.value}\n<\/script>`;
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeMaster Playground Project</title>
    ${css}
</head>
<body>
    ${html}
    ${js}
</body>
</html>`;
    }

    function updatePreview() {
        const html = htmlInput.value;
        const css = `<style>${cssInput.value}</style>`;
        
        // Custom console.log capture
        const js = `
            <script>
                (function() {
                    const oldLog = console.log;
                    const oldError = console.error;
                    const oldWarn = console.warn;
                    
                    function sendMsg(type, args) {
                        try {
                            const msg = Array.from(args).map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
                            window.parent.postMessage({ type: type, data: msg }, '*');
                        } catch(e) {
                            window.parent.postMessage({ type: type, data: String(args[0]) }, '*');
                        }
                    }

                    console.log = function(...args) { sendMsg('log', args); oldLog.apply(console, args); };
                    console.error = function(...args) { sendMsg('error', args); oldError.apply(console, args); };
                    console.warn = function(...args) { sendMsg('log', args); oldWarn.apply(console, args); };

                    window.onerror = function(msg) {
                        window.parent.postMessage({ type: 'error', data: msg }, '*');
                    };
                })();
                try {
                    ${jsInput.value}
                } catch(e) {
                    window.parent.postMessage({ type: 'error', data: e.message }, '*');
                }
            <\/script>
        `;
        
        const combinedCode = `
            ${html}
            ${css}
            ${js}
        `;

        const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(combinedCode);
        iframeDoc.close();

        // Update external window automatically if it's open
        if (externalWindow && !externalWindow.closed) {
            const pureCode = getPureCode();
            const blob = new Blob([pureCode], { type: 'text/html' });
            if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
            currentBlobUrl = URL.createObjectURL(blob);
            externalWindow.location.href = currentBlobUrl;
        }
    }

    window.addEventListener('message', (event) => {
        if (event.data.type === 'log') {
            logToConsole(event.data.data);
        } else if (event.data.type === 'error') {
            logToConsole(event.data.data, 'error');
        }
    });

    // Clear Console
    document.getElementById('clear-btn').addEventListener('click', () => {
        consoleOutput.innerHTML = '<span class="system-msg">> Console cleared.</span>';
    });

    // Refresh Preview
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', updatePreview);
    }

    // Console Input REPL
    const consoleInput = document.getElementById('console-input');
    if (consoleInput) {
        consoleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const code = consoleInput.value.trim();
                if (!code) return;

                // Echo the command
                const span = document.createElement('span');
                span.style.display = 'block';
                span.style.marginBottom = '5px';
                span.style.color = '#e2e8f0';
                span.textContent = '> ' + code;
                consoleOutput.appendChild(span);
                consoleOutput.scrollTop = consoleOutput.scrollHeight;

                // Evaluate in iframe context
                const iframeWin = previewIframe.contentWindow;
                try {
                    // Evaluate code
                    const result = iframeWin.eval(code);
                    
                    // Display result
                    const resSpan = document.createElement('span');
                    resSpan.style.display = 'block';
                    resSpan.style.marginBottom = '5px';
                    resSpan.style.color = '#10b981'; // Green for success
                    
                    if (result === undefined) {
                        resSpan.textContent = '< undefined';
                        resSpan.style.color = '#64748b'; // Gray for undefined
                    } else if (typeof result === 'object' && result !== null) {
                        resSpan.textContent = '< ' + JSON.stringify(result);
                    } else {
                        resSpan.textContent = '< ' + String(result);
                    }
                    consoleOutput.appendChild(resSpan);
                } catch(err) {
                    // Display error
                    const errSpan = document.createElement('span');
                    errSpan.className = 'error-msg';
                    errSpan.style.display = 'block';
                    errSpan.style.marginBottom = '5px';
                    errSpan.style.color = '#ef4444';
                    errSpan.textContent = '< ' + err.toString();
                    consoleOutput.appendChild(errSpan);
                }

                consoleOutput.scrollTop = consoleOutput.scrollHeight;
                consoleInput.value = '';
            }
        });
    }
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            if (typeof JSZip === 'undefined') {
                logToConsole('Error: JSZip library not loaded.', 'error');
                return;
            }

            const zip = new JSZip();
            
            // Add individual files
            zip.file("style.css", cssInput.value);
            zip.file("script.js", jsInput.value);
            
            // Create a properly linked HTML file for the ZIP
            const linkedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeMaster Playground Project</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    ${htmlInput.value}
    <script src="script.js"><\/script>
</body>
</html>`;
            
            zip.file("index.html", linkedHtml);
            
            try {
                const content = await zip.generateAsync({ type: "blob" });
                const url = URL.createObjectURL(content);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'playground-project.zip';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                logToConsole('Project saved to your computer as a ZIP file (playground-project.zip)', 'info');
            } catch (error) {
                logToConsole('Error generating ZIP file: ' + error.message, 'error');
            }
        });
    }

    // Open in External Browser Tab
    const openExtBtn = document.getElementById('open-external-btn');
    if (openExtBtn) {
        openExtBtn.addEventListener('click', () => {
            const code = getPureCode();
            const blob = new Blob([code], { type: 'text/html' });
            if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
            currentBlobUrl = URL.createObjectURL(blob);
            
            if (!externalWindow || externalWindow.closed) {
                externalWindow = window.open(currentBlobUrl);
            } else {
                externalWindow.location.href = currentBlobUrl;
            }

            if (externalWindow) {
                logToConsole('Project opened in a new browser tab. It will auto-update when you click "Run Code".', 'info');
            } else {
                logToConsole('Pop-up blocked. Please allow pop-ups to open the external browser.', 'error');
            }
        });
    }

    // Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            codeInputs.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`${lang}-code`).classList.add('active');
        });
    });

    // Run Code
    runBtn.addEventListener('click', updatePreview);

    // Initial run
    updatePreview();
});
