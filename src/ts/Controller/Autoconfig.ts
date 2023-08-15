import Notifier from "./Notifier.js";
import JSDragDropTree from "./JSDragDropTree.js";
import MASS_CheckerCoverage from "./MASS_CheckerCoverage.js";
import MASSHandler from "./MASSHandler.js";
import MASS_Syntax from "../Model/MASS_Syntax.js";
import {Level} from "../Model/DataStructurs/Level.js";

interface AssociativeArray {
    [key: string]: string
}

export default class Autoconfig {
    
    private DEFAULT_RESULT: string;
    private subfolder: AssociativeArray[] = [];

    constructor() {
        this.DEFAULT_RESULT = new MASSHandler().getDefault_massFullConfig();
    }


    //-[GENERATED CONFIGURATION]------------------------------------------------------------

    public initConfigResult(): void {
        const resultContainer: HTMLTextAreaElement = document.querySelector(".overview_result textarea.boxContainer") as HTMLTextAreaElement;
        resultContainer.value = this.DEFAULT_RESULT;
    }

    public saveResultToClipboard() {
        const resultContainer: HTMLTextAreaElement = document.querySelector(".overview_result textarea.boxContainer") as HTMLTextAreaElement;
        navigator.clipboard.writeText("qf.mass = " + resultContainer.value)
            .then(() => {
                if (resultContainer.value == this.DEFAULT_RESULT) {
                    new Notifier().notif("The default configuration was copied to the clipboard without modification.");
                } else {
                    new Notifier().notif("The generated Configuration was copied to clipboard.");
                }
            })
            .catch((error) => {
                console.error(`Could not copy text: ${error}`);
            });
    }


    //-[AUTOCONFIGURATOR]------------------------------------------------------------
    public resetAutoConfigurator() {
        //reset values of fields of type input file
        const inputFields: any = document.querySelectorAll("input[type=file]");
        inputFields.forEach((input: any) => {
            input.value = '';
        });
        //reset "Level"
        (document.getElementById("syntaxLevel") as HTMLInputElement).value =  Level[Level.BEGINNER];

        //onchange "Show Test Failures"
        (document.getElementById("test_failures") as HTMLInputElement).checked = true;

        //onchange "Show Full Coverage Report"
        (document.getElementById("test_full_report") as HTMLInputElement).checked = false;

        //reset class variables
        this.subfolder = [];
        this.DEFAULT_RESULT = new MASSHandler().getDefault_massFullConfig();
    }


    //-[PROJECT STRUCTUR]------------------------------------------------------------

    //- HTML File Upload using Drag & Drop
    // TODO : Create another input file, after uploading first files and change label

    public updateAllStates() {
        //update file structur
        //build config
    }

    public updateStatesFromSpecInput(specInput: HTMLInputElement, isToUnpack: boolean, isReplacingOld:boolean) {
        var autoconfig = new Autoconfig();
        autoconfig.updateFileStructurFromSpecInput(specInput, isToUnpack);
        autoconfig.buildConfig(specInput.files, isToUnpack), isReplacingOld;
    }

    // TODO Function to unzip archive
    public unpackArchive(file: File) {
        var folderStructure = document.getElementById('filehierarchy_tree');
        var autoconfig = new Autoconfig();
        if (file.name.endsWith('.zip')) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const data = event.target.result;
                JSZip.loadAsync(data).then(zipData => {
                    autoconfig.displayFolderStructure(zipData, folderStructure);
                });
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert('Please select a Zip file.');
        }
    }

    
    public displayFolderStructure(folder, parentElement) {
        //TODO: case:foundFolder>foundFolder>newFolder>File 
        //alert(JSON.stringify(folder));
        folder.forEach((relativePath, file) => {
            let trueParent = parentElement;
            //TODO create directories and append files | ignore folders when directory already created
            let folderPrepared = relativePath.substring(0, relativePath.length - 1) as string;
            let lastIndexSlash = folderPrepared.lastIndexOf("/");
            let folderName = lastIndexSlash > -1 ? folderPrepared.substring(lastIndexSlash + 1) : folderPrepared as string;
            let folderParent = lastIndexSlash > -1 ? folderPrepared.substring(0, lastIndexSlash + 1) : "" as string;
            //alert("parent:"+folderParent+ " | son:"+folderName); 
            if (folderParent != "" && this.subfolder[folderParent] !== undefined) {
               trueParent = document.getElementById(this.subfolder[folderParent]);
                if(!(trueParent.innerHTML.includes("ul"))){
                    let subFolderAppending = document.createElement("ul");
                    trueParent.appendChild(subFolderAppending);
                    trueParent = trueParent.getElementsByTagName("ul")[0];
                }
            } else if (folderParent != "") {
                //create directories > and save object, then append on filestructur
                let directoryConcat = folderParent;
                let highestSlash = folderParent.lastIndexOf("/");
                let highestParent = directoryConcat.substring(0, highestSlash+1);
                if(highestParent.indexOf("/") == -1){
                    const folderElement = document.createElement('li');
                    let folderId = "node" + Date.now().toString();
                    folderElement.id = folderId;
                    let listItemAnchor = document.createElement("a");
                    listItemAnchor.innerText = folderName;
                    folderElement.appendChild(listItemAnchor);
                    this.subfolder[highestParent] = folderId;
                    parentElement.appendChild(folderElement);
                }else{
                    while(highestSlash > -1){
                        highestParent = directoryConcat.substring(0, highestSlash+1);
                        if(this.subfolder[highestParent] === undefined){
                            const folderElement = document.createElement('li');
                            let folderId = "node" + Date.now().toString();
                            folderElement.id = folderId;
                            let listItemAnchor = document.createElement("a");
                            listItemAnchor.innerText = folderName;
                            folderElement.appendChild(listItemAnchor);
                            this.subfolder[highestParent] = folderId;
                            if((document.getElementById(this.subfolder[highestParent]).innerHTML).includes("ul")){
                                document.getElementById(this.subfolder[highestParent]).appendChild(folderElement);
                            }else{
                                let subFolderAppending = document.createElement("ul");
                                document.getElementById(this.subfolder[highestParent]).appendChild(subFolderAppending);
                                ((document.getElementById(this.subfolder[highestParent])).getElementsByTagName("ul")[0]).appendChild(folderElement);
                            }      
                            this.subfolder[highestParent] = folderId;
                        }
                        directoryConcat = directoryConcat.substring(highestSlash+1);
                        highestSlash = directoryConcat.lastIndexOf("/");
                    }
                }
            }
            //alert("1");
            if (file.dir) { //folder
                const folderElement = document.createElement('li');
                let folderId = "node" + Date.now().toString();
                folderElement.id = folderId;
                let listItemAnchor = document.createElement("a");
                listItemAnchor.innerText = folderName;
                folderElement.appendChild(listItemAnchor);
                //save path and node id
                if (folderParent != "" && this.subfolder[folderParent] !== undefined) {
                    if (!((trueParent.innerHTML).includes("ul"))) {
                        let subFolderElement = document.createElement('ul');
                        folderElement.appendChild(subFolderElement);
                    }
                } else if (folderParent != "") {
                    this.subfolder[folderParent] = folderId;
                } else  if (folderParent == ""){
                    this.subfolder[folderName+"/"] = folderId;
                }
                //if element start with existing path, append element in existing path
                //const subFolder = folder.folder(relativePath);
                //const subFolderElement = document.createElement('ul');
                //folderElement.appendChild(subFolderElement);
                trueParent.appendChild(folderElement);
                //alert("2");
                //this.displayFolderStructure(subFolder, subFolderElement);
            } else { //file
                //alert("3");
                const fileElement = document.createElement('li');
                //fileElement.textContent = relativePath;
                const fileElementAnchor = document.createElement("a");
                fileElement.id = "node" + Date.now().toString();
                fileElement.classList.add("filehierarchy_endNode");
                fileElement.setAttribute("noDrag", "false");
                fileElement.setAttribute("noSiblings", "false");
                fileElement.setAttribute("noDelete", "false");
                fileElement.setAttribute("noRename", "false");
                fileElement.setAttribute("noChildren", "true");
                fileElementAnchor.innerText = relativePath.substring(relativePath.lastIndexOf("/") + 1);
                fileElement.appendChild(fileElementAnchor);
                trueParent.appendChild(fileElement);
                //alert("4");
            }
        });
        var treeObj = new JSDragDropTree();
        treeObj.setTreeId('filehierarchy_tree');
        treeObj.setMaximumDepth(7);
        treeObj.setMessageMaximumDepthReached('Maximum depth reached');
        treeObj.initTree();
        //alert(Object.keys(this.subfolder));
    }

    // TODO Function to search comments > keywords inside comments > next instruction's line
    public searchMassKeysRanges() {

    }

    //TODO Function to update or create file the whole structur
    public updateAllFileStructur() {

    }

    //TODO Function to update or create file from a specific file-input field structur
    public updateFileStructurFromSpecInput(specInput: HTMLInputElement, isToUnpack: boolean) {
        var autoconfig = new Autoconfig();
        //hide box upload if not hidden
        const dropBox = document.querySelector("div.overview_form div.boxUpload");
        const fileStructureBox = document.querySelector("div.overview_form div.boxContainer");
        const fileTreeTop = document.getElementById("filehierarchy_tree") as HTMLUListElement;
        dropBox.classList.add("none");
        fileStructureBox.classList.remove("none");
        //append files on in root of file structure
        if (isToUnpack) {
            //unzip and add files and folders
            autoconfig.unpackArchive(specInput.files[0]);
        } else {
            //TODO check if folder or file
            //TODO check daughters
            //Add files on file-structure without unpack
            for (let i = 0; i < specInput.files.length; i++) {
                const listItem = document.createElement("li");
                const listItemAnchor = document.createElement("a");
                listItem.id = "node" + Date.now().toString();
                listItem.classList.add("filehierarchy_endNode");
                listItem.setAttribute("noDrag", "false");
                listItem.setAttribute("noSiblings", "false");
                listItem.setAttribute("noDelete", "false");
                listItem.setAttribute("noRename", "false");
                listItem.setAttribute("noChildren", "true");
                //listItemAnchor.innerText = specInput.files[i].webkitRelativePath || specInput.files[i].name;
                listItemAnchor.innerText = specInput.files[i].name;
                //let file = specInput.files[i];
                //listItemAnchor.innerText += "  | " + file.webkitRelativePath;
                listItem.appendChild(listItemAnchor);
                fileTreeTop.appendChild(listItem);
            }
        }
        var treeObj = new JSDragDropTree();
        treeObj.setTreeId('filehierarchy_tree');
        treeObj.setMaximumDepth(7);
        treeObj.setMessageMaximumDepthReached('Maximum depth reached');
        treeObj.initTree();
    }

    // TODO Function to generate the configuration
    public buildConfig(files: FileList, isToUnpack: boolean = false, isReplacingOld:boolean=true) {
        //1- Build Feedbacks Block (always from all input fields)
        //2- Also show syntactic errors in keywords parameters
        //3- Build file structure > correct files parents
        new MASS_CheckerCoverage().buildConfigFromJavaFile(files, isReplacingOld);
    }

    // TODO function which build config from all uploaded files
    public buildConfigWholeConfig() {

    }

    //Function of the first step to build the configuration after an upload
    public startFirstStepUpload(currentInputFile: HTMLInputElement, isReplacingOld:boolean) {
        var autoconfig = new Autoconfig();
        const files: FileList = currentInputFile.files;

        if (files.length == 1 && files[0].name.endsWith('.zip')) {
            var notifier = new Notifier();
            let prepNotif: string = '<h3> Archive Upload </h3> ' +
                '<p> Does the archive file need to be unzipped before adding to the project? </p> <br/> ' +
                '<p> <button id="btnUnzipUploading">yes</button> <button id="btnKeepUploading">no</button> </p> ';
            notifier.notif(prepNotif);
            const btnUnzip = document.getElementById("btnUnzipUploading");
            btnUnzip.addEventListener("click", () => {
                autoconfig.updateStatesFromSpecInput(currentInputFile, true, isReplacingOld);
                notifier.removeNotif(true);
            });
            const btnOnlyUpload = document.getElementById("btnKeepUploading");
            btnOnlyUpload.addEventListener("click", () => {
                autoconfig.updateStatesFromSpecInput(currentInputFile, false, isReplacingOld);
                notifier.removeNotif(true);
            });
            return;
        }
        autoconfig.updateStatesFromSpecInput(currentInputFile, false, isReplacingOld);

    }


    // TODO Function to handle file drop event
    public handleFileDrop(event: DragEvent) {
        event.preventDefault();
        var autoconfig = new Autoconfig();
        const dropArea = document.querySelector(".overview_form .boxUpload");
        const currentInputFile = document.getElementById("projectFile") as HTMLInputElement;

        // Highlight the drop area
        dropArea.classList.add("highlight");

        // Get the files from the event
        const files: FileList = event.dataTransfer.files;
        currentInputFile.files = files;
        autoconfig.startFirstStepUpload(currentInputFile, true);
        /*
        if (event.dataTransfer.types[i] == "Files") {
            return true;
        }
        */
    }

    // Function to handle file dragover event
    public handleFileDragOver(event: DragEvent) {
        event.preventDefault();
    }

    // Function to handle file dragleave event
    public handleFileDragLeave(event: DragEvent) {
        const dropArea = document.querySelector(".overview_form .boxUpload");
        // Remove the highlight from the drop area
        dropArea.classList.remove("highlight");
    }

    public resetProjectStructur() {
        //remove all elements from the file structure
        document.getElementById("filehierarchy_tree").innerHTML = "";
        //add class .none to container of file structure | remove class .none drop box
        let dropBoxP = document.querySelector("div.overview_form div.boxUpload");
        let fileStructureBoxP = document.querySelector("div.overview_form div.boxContainer");
        fileStructureBoxP.classList.add("none");
        dropBoxP.classList.remove("none");
    }


    //-[APP]------------------------------------------------------------
    public resetApp() {
        var autoconfig = new Autoconfig();
        autoconfig.resetProjectStructur();
        autoconfig.resetAutoConfigurator();
        autoconfig.initConfigResult();
        new Notifier().notif("The Configurator have been reseted");
    }


    //-[DOM LOADED]------------------------------------------------------------
    public initApp() {

        window.addEventListener("DOMContentLoaded", (event) => {

            this.initConfigResult();

            // Add event listeners to the drop area
            const dropArea = document.querySelector(".overview_form .boxUpload");
            dropArea.addEventListener("drop", this.handleFileDrop);
            dropArea.addEventListener("dragover", this.handleFileDragOver);
            dropArea.addEventListener("dragleave", this.handleFileDragLeave);

            //onclick button reset : resetApp()
            document.querySelector(".overview_result .tab_head_options .uil-refresh").addEventListener('click', this.resetApp);

            //Copy the result when the button is clicked: Save the result to the clipboard
            document.querySelector(".overview_result .tab_head_options .uil-copy").addEventListener('click', this.saveResultToClipboard);

            //onchange principal input file
            const inputFile0 = document.getElementById("projectFile") as HTMLInputElement;
            inputFile0.addEventListener("change", () => this.startFirstStepUpload(inputFile0, true));

            //onchange "Level"
            const selectLevel = document.getElementById("syntaxLevel") as HTMLInputElement;
            selectLevel.addEventListener("change", () => {
                let syntaxLevel: Level = selectLevel.value == "ADVANCED" ? Level.ADVANCED : Level.BEGINNER;
                 new MASS_Syntax(syntaxLevel).updateResult()} 
            );

            //onchange "Show Test Failures"
            const selectTestFailures = document.getElementById("test_failures") as HTMLInputElement;
            selectTestFailures.addEventListener("change", () => new MASS_CheckerCoverage().updateResult_testFailures(selectTestFailures.checked));

            //onchange "Show Full Coverage Report"
            const selectFullCovReport = document.getElementById("test_full_report") as HTMLInputElement;
            selectFullCovReport.addEventListener("change", () => new MASS_CheckerCoverage().updateResult_testFullReport(selectFullCovReport.checked));

        });
    }
}