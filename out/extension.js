"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const passthrough = (literals, ...placeholders) => literals.reduce((acc, literal, i) => {
    if (placeholders[i] != null && placeholders[i] !== false) {
        return acc + literal + String(placeholders[i]);
    }
    return acc + literal;
}, "");
exports.css = passthrough;
exports.html = passthrough;
const clipCss = exports.css `
  :root {
    --border: #000;
    --bg: #feffc6;
  }
  .vscode-dark {
    --border: #fff;
  }
  body {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 12em;
    grid-gap: 3em;
    position: absolute;
    image-rendering: pixelated;
    top: 1em;
    left: 1em;
    right: 1em;
    bottom: 1em;
    justify-items: flex-end;
  }
  .msg {
    justify-self: stretch;
    color: #000;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 1em;
    padding: 1em;
    position: relative;
  }
  .msg:after {
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    border-right: 1px solid var(--border);
    width: 3em;
    height: 3em;
    content: "";
    position: absolute;
    bottom: -1.5em;
    right: 5em;
    transform: rotate(-45deg);
  }
`;
const clip = (msg) => exports.html `
  <style>
    ${clipCss}
  </style>
  <body>
    <div class="msg">${msg}</div>
    <img
      src="https://i.gifer.com/origin/c6/c6afab251a20e6d0eb80b983450bc66e_w200.gif"
    />
  </body>
`;
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        let clippy;
        const disposeOfClippy = () => {
            if (clippy) {
                clippy.dispose();
            }
        };
        const showClippy = ({ source = "nice", errors }) => {
            disposeOfClippy();
            clippy = vscode.window.createWebviewPanel("waa", "sdsds", {
                viewColumn: vscode.ViewColumn.Beside,
                preserveFocus: true
            });
            const text = `It looks like you are writing some ${source.toUpperCase()} code! But ${errors
                .map(e => `${e.message
                .slice(0, -1)
                .split("")
                .map((k, i) => (i === 0 ? k.toLowerCase() : k))
                .map((k, i) => (i === e.message.length && k === "." ? "" : k))
                .join("")} on line ${e.range.start.line}`)
                .join(" and ")}. You should really fix that?`;
            clippy.webview.html = clip(text);
        };
        vscode.languages.onDidChangeDiagnostics(e => {
            e.uris.forEach(uri => {
                if (!vscode.window.activeTextEditor) {
                    return;
                }
                if (vscode.window.activeTextEditor.document.uri.toString !== uri.toString) {
                    return;
                }
                const diags = vscode.languages.getDiagnostics(uri);
                if (diags.length < 1) {
                    disposeOfClippy();
                }
                else {
                    showClippy({
                        source: diags[0].source,
                        errors: diags
                    });
                }
            });
        });
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map