import { Uri, window, workspace, extensions, TextDocument, Position, Selection } from "vscode";
import * as path from "path";
import * as fs from 'fs';

export class ContextualMenu {

    public static init(uri: Uri, fileType: string) {
        let pathSelected: string = uri.fsPath;

        window.showInputBox({ignoreFocusOut: true, prompt: `Type the ${fileType} name`, value: 'New ' + fileType + '.ts'})
            .then((newFileName) => {
                if (typeof(newFileName) === undefined || newFileName === '') {
                    window.showErrorMessage('Please input a valid name or press Scape to cancel the operation!');
                    return this.init(uri, fileType);
                }

                let newFilePath = pathSelected + path.sep + newFileName;
                if (fs.existsSync(newFilePath)) {
                    window.showErrorMessage(`File ${newFileName} already exist!`);
                    return;
                }
                
                newFilePath = correctFileNameExtension(newFilePath);
                let originalFilepath = newFilePath;

                loadTemplate(fileType, newFilePath, originalFilepath);
            }
        );
    }
}

// fix file extension in case user forget to input file.ts
function correctFileNameExtension(newFilePath: string): string {
    if (path.extname(newFilePath) !== '.ts') {
        if (newFilePath.endsWith('.')) {
            newFilePath = newFilePath + 'ts';
        } else {
            newFilePath = newFilePath + '.ts';
        }
    }
    return newFilePath;
}


function loadTemplate(fileType: string, newFilePath: string, originalFilepath: string) {
    let fileTemplate = fileType + '.tpl';
    let isInterface = (fileType === 'interface')? true : false;

    workspace.openTextDocument(extensions.getExtension('richardzampieriprog.typescriptFacility')?.extensionPath + '/templates/' + fileTemplate)
        .then((doc:TextDocument) => {
            newFilePath = path.basename(newFilePath, '.ts');
            if (isInterface) {
                if (newFilePath[0] !== 'I') {
                    newFilePath = "I" + newFilePath;
                } 
            }
            let content = doc.getText();
            content = content.replace('${fileName}', newFilePath);
            let cursorPos = findCursorPosition(content);
            content = content.replace('${cursor}', '');
            fs.writeFileSync(originalFilepath, content);

            workspace.openTextDocument(originalFilepath).then((doc) => {
                window.showTextDocument(doc).then((editor) => {
                    let selection = new Selection(cursorPos, cursorPos);
                    editor.selection = selection;
                });
            });
        }
    );

}

function findCursorPosition(content: string) {
    let cursorPos = content.indexOf('${cursor}');
    let beforePos = content.substring(0, cursorPos);
    let line = beforePos.match(/\n/gi)?.length;
    let charId = beforePos.substring(beforePos.lastIndexOf('\n')).length;

    return new Position((line !== undefined)? line : 0, charId);
}

