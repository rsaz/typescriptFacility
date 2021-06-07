import {ExtensionContext, commands, window, Uri} from 'vscode';
import { ContextualMenu } from './contextualMenu/ContextualMenu';

export class CommandsRegister {
    private static instance: CommandsRegister;
    private context!: ExtensionContext;
    
    constructor() {}

    public static getInstance(): CommandsRegister {
        if (!CommandsRegister.instance) {
            CommandsRegister.instance = new CommandsRegister();
        }
        return CommandsRegister.instance;
    }

    public initializeCommands(context: ExtensionContext): void {
        this.context = context;

        // initialize all commands
        this.contextMenuActivation();
    }

    // ****** command registration ****** //
    private contextMenuActivation(): void {
        this.context.subscriptions.push(commands.registerCommand('typescriptFacility.createClass', async (uri: Uri) =>
            ContextualMenu.init(uri, 'class')
        ));

        this.context.subscriptions.push(commands.registerCommand('typescriptFacility.createInterface', async (uri: Uri) =>
            ContextualMenu.init(uri, 'interface')
        ));
    }

}