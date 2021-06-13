import { window, ViewColumn, WebviewPanel, ExtensionContext, Uri } from "vscode";

export class CreateProject {

    private _currentPanel: WebviewPanel | undefined = undefined;
    private _context: ExtensionContext;

    constructor(context: ExtensionContext, currentPanel: WebviewPanel | undefined = undefined ) {
        this._context = context;
        this._currentPanel = currentPanel;
    }

    public start(): WebviewPanel | undefined {
        return this.createPanel();
    };

    private createPanel(): WebviewPanel | undefined {
        const columnToShowIn: (ViewColumn | undefined) = window.activeTextEditor? 
            window.activeTextEditor.viewColumn : undefined;
        
        if (this._currentPanel) {
            this._currentPanel.reveal(columnToShowIn);
        } else {
            this._currentPanel = window.createWebviewPanel(
                'createProject',
                'New Typescript Project',
                columnToShowIn,
                {
                    enableScripts: true,
                    localResourceRoots: [
                        Uri.joinPath(this._context.extensionUri, 'html'),
                        Uri.joinPath(this._context.extensionUri, 'out')
                    ],
                }
            );

            // passing resources to the webview
            const scriptSheet = this._currentPanel.webview.asWebviewUri(Uri.joinPath(this._context.extensionUri,'html','main.js'));
            const styleSheetVS = this._currentPanel.webview.asWebviewUri(Uri.joinPath(this._context.extensionUri,'html','vscode.css'));    
            const styleSheetReset = this._currentPanel.webview.asWebviewUri(Uri.joinPath(this._context.extensionUri,'html','reset.css'));    

            this._currentPanel.webview.html = getWebViewContent(styleSheetVS, styleSheetReset, this._currentPanel.webview, scriptSheet);
        }

        return this._currentPanel;
    }
}

function getWebViewContent(vscodeCss, resetCss, webview, script): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cat Coding</title>
        <link href="${resetCss}" rel="stylesheet">
        <link href="${vscodeCss}" rel="stylesheet"> 
    </head>
    <body>
        <button id="selectFolder">...</button>
        <script nonce="${getNonce()}" src="${script}"></script>
    </body>
    </html>`;
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
