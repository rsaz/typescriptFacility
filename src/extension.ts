import * as vscode from 'vscode';
import { CommandsRegister } from './CommandsRegister';

export function activate(context: vscode.ExtensionContext) {
	const commands = CommandsRegister.getInstance();
	commands.initializeCommands(context);	
}

export function deactivate() {}