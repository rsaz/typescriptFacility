import {WebviewPanel, ExtensionContext, commands, window, Uri} from 'vscode';
import { ContextualMenu } from './contextualMenu/ContextualMenu';
import { CreateProject } from './createProject/CreateProject';
import { Panel } from './createProject/Panel';

export class CommandsRegister {
    private static _instance: CommandsRegister;
    private _context!: ExtensionContext;
    private currentPanel: WebviewPanel | undefined;
    
    constructor() {}

    public static getInstance(): CommandsRegister {
        if (!CommandsRegister._instance) {
            CommandsRegister._instance = new CommandsRegister();
        }
        return CommandsRegister._instance;
    }

    public initializeCommands(context: ExtensionContext): void {
        this._context = context;

        // initialize all commands
        this.contextMenuActivation();
        this.createProjectActivation();
    }

    // ****** command registration ****** //
    private contextMenuActivation(): void {
        this._context.subscriptions.push(commands.registerCommand('typescriptFacility.createClass', async (uri: Uri) =>
            ContextualMenu.init(uri, 'class')
        ));

        this._context.subscriptions.push(commands.registerCommand('typescriptFacility.createInterface', async (uri: Uri) =>
            ContextualMenu.init(uri, 'interface')
        ));
    }

    private createProjectActivation(): void {
        this._context.subscriptions.push(commands.registerCommand('typescriptFacility.createProject', ()=> {
            //let createProject = new CreateProject(this._context, this.currentPanel);
            //this.currentPanel = createProject.start();
            let	panel = new Panel(this._context, 'App Launch',{folder: 'media', file: 'script.svg'});
		    panel.allowedLocalResource('media');
            
            // disposing panel after using
            panel.webViewPanel.onDidDispose(()=> {panel.webViewPanel = undefined;}, null, this._context.subscriptions);
        }));
    }

}