// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.

(function () {

    // vscode api
    const vscode = acquireVsCodeApi();

    // Html elements bindings
    //const buttonCreateProject = document.getElementById('create-project-button');
    const buttonFilePicker = document.getElementById('type-create');
    //const template = document.getElementById('custom-select');
    //const project = document.getElementById('projectName');
    //const filePath = document.getElementById('inputLocal');
    //const solution = document.getElementById('solution');
    //const framework = document.getElementById('custom-select2');
    /*
    document.addEventListener("DOMContentLoaded", function(event) {
        buttonCreateProject.disabled = "true";
        buttonCreateProject.style.backgroundColor = "#3C3C3C";
        fieldValidation();
    });
    
    function fieldValidation() {
        if (project.value === "" || solution.value === "" || filePath.value === "") { 
            buttonCreateProject.disabled = true;
        } else {
            buttonCreateProject.disabled = false;
            buttonCreateProject.style.backgroundColor = "#0E639C";
        }
    }

    template.addEventListener('keydown'| 'click', ()=>{
        project.focus();
    });

    project.addEventListener('change', () => {
        fieldValidation();
        solution.value = project.value;
    });

    solution.addEventListener('keyup', () => {
        fieldValidation();
    });

    filePath.addEventListener('keyup' | 'focus', () => {
        fieldValidation();
    });

    filePath.addEventListener('keydown', ()=>{
        buttonFilePicker.focus();
    });

    // create console project
    buttonCreateProject.addEventListener('click', () => {
        vscode.postMessage({
            command: 'createProject',
            template: template.options[template.selectedIndex].value,
            project: project.value,
            filePath: filePath.value,
            solution: solution.value,
            framework: framework.options[framework.selectedIndex].value,
        });
    });
    */
    // file picker to save the project in a specific location
    buttonFilePicker.addEventListener('click', ()=> {
        console.log('file picker');
        solution.focus();
        vscode.postMessage({
            //command: "selectDirectory",
            //templateName: template.options[template.selectedIndex].text,
            //template: template.options[template.selectedIndex].value,
            //project: project.value,
            //solution: solution.value,
            //framework: framework.options[framework.selectedIndex].value,
            });
        });        
        
})();
