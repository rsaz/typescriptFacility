import {window, Uri, ViewColumn, WebviewPanel, ExtensionContext, WebviewOptions} from 'vscode';
import * as path from 'path';
import { readFileSync } from 'fs';

export class Panel {

    readonly _context: ExtensionContext;    
    private _webViewPanel: WebviewPanel | undefined = undefined;
    private _vscodeCss!: Uri;
    private _resetCss!: Uri;
    private _typescriptIcon!: Uri;
    private _expressIcon!: Uri;
    private _nestIcon!: Uri;
    private _script!: Uri;

    constructor(
    context: ExtensionContext,
    title: string,
    iconPath: {folder: string, file: string} = {folder:'', file:''},
    viewColumn: ViewColumn = ViewColumn.One,
    preserveFocus: boolean = false,
    enableFindWidget: boolean = false,
    retainContextWhenHidden: boolean = false
    ) {
        // context from the extension main entry point
        this._context = context;

        let _viewType:string = title.replace(/[^A-Z0-9]/ig,"-");
        
        if (this._webViewPanel) {
          this._webViewPanel.reveal(window.activeTextEditor?.viewColumn);
        } else {
           // creating the panel
          this._webViewPanel = window.createWebviewPanel(_viewType, title, {preserveFocus, viewColumn},{enableFindWidget, retainContextWhenHidden});
          this._webViewPanel.iconPath = Uri.file(path.join(this._context.extensionPath,iconPath.folder, iconPath.file));
        
          // webview options
          this._webViewPanel.webview.options = {
            enableCommandUris: false,
            enableScripts: true,
            localResourceRoots: [],
            portMapping: []
          };

          // html content
          this._resetCss = this._webViewPanel.webview.asWebviewUri(Uri.file(path.join(this._context.extensionPath, 'media', 'reset.css')));
          this._vscodeCss = this._webViewPanel.webview.asWebviewUri(Uri.file(path.join(this._context.extensionPath, 'media', 'vscode.css')));
          this._typescriptIcon = this._webViewPanel.webview.asWebviewUri(Uri.file(path.join(this._context.extensionPath, 'media', 'typescript.svg')));
          this._expressIcon = this._webViewPanel.webview.asWebviewUri(Uri.file(path.join(this._context.extensionPath, 'media', 'express.svg')));
          this._nestIcon = this._webViewPanel.webview.asWebviewUri(Uri.file(path.join(this._context.extensionPath, 'media', 'nest.svg')));
          this._script = this._webViewPanel.webview.asWebviewUri(Uri.file(path.join(this._context.extensionPath, 'media', 'main.js')));
          this._webViewPanel.webview.html = this.baseHtml('index.html', this._resetCss, this._vscodeCss,this._typescriptIcon, this._expressIcon, this._nestIcon, this._script);
        }
    }

    public get webViewPanel(): WebviewPanel | undefined {return this._webViewPanel;}
    public set webViewPanel(panelInstance: WebviewPanel | undefined) { this._webViewPanel = panelInstance;}

    public set iconPath(icon: {folder: string, file: string} | {folder: string, file: string}[]) {
      if (this._webViewPanel) {
        if (Array.isArray(icon)) {
          this._webViewPanel.iconPath = {
            dark: Uri.file(path.join(this._context.extensionPath,icon[0].folder, icon[0].file)),
            light: Uri.file(path.join(this._context.extensionPath,icon[1].folder, icon[1].file))
          };  
        } else {
          this._webViewPanel.iconPath = Uri.file(path.join(this._context.extensionPath,icon.folder, icon.file));
        }
      }
    }

    public set options(options: WebviewOptions) {
      if (this._webViewPanel) {
        this._webViewPanel.webview.options = options;
      }
    }
    public allowedLocalResource(...folders: string[])
    {
      if (this._webViewPanel) {
        let foldersRoot: Uri[] = [];

        for (let i:number = 0; i < folders.length; i++)
        {
          foldersRoot[i] = Uri.file(path.join(this._context.extensionPath, folders[i]));
        }

        this._webViewPanel.webview.options = {
          localResourceRoots: foldersRoot
        };
      }
    }

    public set html(htmlDoc: string) {
      if (this._webViewPanel) {
        this._webViewPanel.webview.html = htmlDoc;
      };
    }

    public addResource(content: {folder: string, resource: string}): Uri | undefined {
      const diskResource = Uri.file(path.join(this._context.extensionPath, content.folder, content.resource));
      return this._webViewPanel?.webview.asWebviewUri(diskResource);
    }

    private baseHtml(page:string, ...resource: Uri[]): string {
      let html = readFileSync(path.join(this._context.extensionPath, 'media', page), 'utf-8');
      html = html.replace(`{{resetCss}}`, resource[0].toString());  
      html = html.replace(`{{vscodeCss}}`, resource[1].toString()); 
      html = html.replace(`{{typescriptIcon}}`, resource[2].toString());
      html = html.replace(`{{expressIcon}}`, resource[3].toString());
      html = html.replace(`{{nestIcon}}`, resource[4].toString());
      html = html.replace(`{{script}}`, resource[5].toString());
      return html.toString();
    }
}