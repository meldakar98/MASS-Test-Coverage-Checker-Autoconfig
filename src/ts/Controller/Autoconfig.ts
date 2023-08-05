import Notifier from "./Notifier.js";

export default class Autoconfig{

    //TODO set the different objects of the configuratior with parsing verifications
    private DEFAULT_RESULT: string;

    constructor() {
        this.DEFAULT_RESULT = '{\n  "syntax": {\n    "level": "BEGINNER"\n  },\n  "styleSelected": false,\n  "semanticSelected": false,\n  "coverageSelected": false,\n  "classSelected": false,\n  "metricsSelected": false,\n  "style": {\n    "basisLevel": "BEGINNER",\n    "complexityLevel": "BEGINNER",\n    "namesLevel": "BEGINNER",\n    "classLength": -1,\n    "methodLength": -1,\n    "cyclomaticComplexity": -1,\n    "fieldsCount": -1,\n    "variableNamePattern": "[a-z][a-zA-Z0-9]*",\n    "methodNamePattern": "[a-z][a-zA-Z0-9]*",\n    "methodParameterNamePattern": "[a-z][a-zA-Z0-9]*",\n    "classNamePattern": "[A-Z][a-zA-Z0-9_]*"\n  },\n  "semantic": {},\n  "coverage": {\n    "feedback": [\n      {\n        "lineRanges": "",\n        "message": "",\n        "showFor": "PARTIALLY_MISSED",\n        "fileName": ""\n      }\n    ],\n    "showFullCoverageReport": false,\n    "showTestFailures": true\n  },\n  "classes": {},\n  "metrics": {\n    "amcThreshold": {\n      "min": 0,\n      "max": 100,\n      "noMax": false,\n      "suggestionMin": "Increase your average method size, e.g. by joining multiple methods with mostly the same functionalities from over-engineering.",\n      "suggestionMax": "Decrease your average method size, e.g. by delegating functionalities to other newly created methods."\n    },\n    "caThreshold": {\n      "min": 0,\n      "max": 100,\n      "noMax": false,\n      "suggestionMin": "This class is used by too few other classes. Is this class even necessary? Can you implement this class\'s functionalities into already existing classes?",\n      "suggestionMax": "This class is used by too many other classes. Can you outsource some functionalities into already existing or new classes?"\n    },\n    "camThreshold": {\n      "min": 0,\n      "max": 1,\n      "noMax": false,\n      "suggestionMin": "This class and their methods are or are close to being un-cohesive. Assimilate methods in your class in order to increase readability and decrease complexity at once.",\n      "suggestionMax": "This class and their methods are too cohesive. Your implemented methods are too close to being the same methods."\n    },\n    "cbmThreshold": {\n      "min": 0,\n      "max": 5,\n      "noMax": false,\n      "suggestionMin": "The methods in this class are not or are hardly coupled, which means they have (close to) no interdependencies. Is this reasonable for your class?",\n      "suggestionMax": "The methods in this class are coupled to high, which means too many interdependencies, coordination and information flow between them. Try to minimize these dependencies between your methods."\n    },\n    "cboThreshold": {\n      "min": 0,\n      "max": 5,\n      "noMax": false,\n      "suggestionMin": "The sum of all class couplings in this class is (close to) zero, which means they have (close to) no interdependencies to other classes. Is this reasonable for your class? Also, refer to afferent/efferent coupling metric.",\n      "suggestionMax": "The sum of all class couplings in this class is too high, which means too many interdependencies, coordination and information flow between them. Try to minimize these dependencies from this class to other classes. Also, refer to afferent/efferent coupling metric."\n    },\n    "ccThreshold": {\n      "min": 1,\n      "max": 100,\n      "noMax": true,\n      "suggestionMin": "This method in the given class has very few different paths to take. It would be allowed to increase its complexity.",\n      "suggestionMax": "This method in the given class is too complex, too many paths are taken (ite-statements). Try to decrease the complexity by delegating functionalities into other methods or classes."\n    },\n    "ceThreshold": {\n      "min": 0,\n      "max": 100,\n      "noMax": false,\n      "suggestionMin": "This class is using too few other classes. Can some functionalities be implemented into other classes and be used?",\n      "suggestionMax": "This class is using too many other classes. Can some functionalities be joined by other classes or even be implemented in this specific class?"\n    },\n    "damThreshold": {\n      "min": 0,\n      "max": 1,\n      "noMax": false,\n      "suggestionMin": "This class contains very few private (protected) attributes compared to to the total number of attributes. Try to encapsulate your class (make fields private, only access them by methods contained in this specific class if possible).",\n      "suggestionMax": "This class contains many private (protected) attributes compared to to the total number of attributes. Encapsulation is important, but sometimes over-engineering. Is this reasonable?"\n    },\n    "ditThreshold": {\n      "min": 1,\n      "max": 6,\n      "noMax": false,\n      "suggestionMin": "This class has very few superclasses or only one superclass (Object.java). Is inheritance a possible option?",\n      "suggestionMax": "This class has many superclasses. Is this much inheritance possible over-engineering? Do certain subclasses have too similar or too few functionalities?"\n    },\n    "icThreshold": {\n      "min": 0,\n      "max": 6,\n      "noMax": false,\n      "suggestionMin": "This class is coupled to few or no parent classes. Overriding parent methods could be a suitable option here.",\n      "suggestionMax": "This class is coupled to many parent classes. Overriding parent methods makes sense, but is not always necessary."\n    },\n    "lcomThreshold": {\n      "min": 0,\n      "max": 100,\n      "noMax": false,\n      "suggestionMin": "The modularisation of this class is too low. Too many methods operate on different attributes.",\n      "suggestionMax": "The modularisation of this class is quite high. You could think about the necessity if your class is very small."\n    },\n    "lcom3Threshold": {\n      "min": 0,\n      "max": 2,\n      "noMax": false,\n      "suggestionMin": "The modularisation of this class is too low. Too many methods operate on different attributes.",\n      "suggestionMax": "The modularisation of this class is quite high. You could think about the necessity if your class is very small."\n    },\n    "locThreshold": {\n      "min": 0,\n      "max": 100,\n      "noMax": false,\n      "suggestionMin": "This class contains very few lines of code. Is it even necessary to put these functionalities into a separate class?",\n      "suggestionMax": "This class contains too many lines of code, it could be considered as a \\"God Class\\". Try to keep only the main functionality in this class, others should be implemented into other (new) classes."\n    },\n    "mfaThreshold": {\n      "min": 0,\n      "max": 1,\n      "noMax": false,\n      "suggestionMin": "The functional abstraction of this class ist quite low. If possible, try to let his class inherit some methods.",\n      "suggestionMax": "The functional abstraction of this class is very high. Consider refactoring this class into an abstract class if this is not yet the case."\n    },\n    "moaThreshold": {\n      "min": 0,\n      "max": 100,\n      "noMax": false,\n      "suggestionMin": "This class contains too few class fields. In order to increase class aggregation, also increase the number of fields or merge this class into another.",\n      "suggestionMax": "This class contains too many class fields. Try to inline fields or extract functionalities into other classes."\n    },\n    "nocThreshold": {\n      "min": 0,\n      "max": 100,\n      "noMax": false,\n      "suggestionMin": "This class has very few or no immediate descendants. Would extending this class be reasonable?",\n      "suggestionMax": "This class has too much immediate descendants. Consider using multiple inheritance, i.e. creating subclasses of a subclass."\n    },\n    "npmThreshold": {\n      "min": 0,\n      "max": 100,\n      "noMax": false,\n      "suggestionMin": "This class uses few or no public methods. Is this intended?",\n      "suggestionMax": "This class uses mostly public methods. Try to decrease their visibility to force the information hiding principle."\n    },\n    "rfcThreshold": {\n      "min": 0,\n      "max": 100,\n      "noMax": false,\n      "suggestionMin": "This class has too few or zero (in-)directly executable methods. Is this class even necessary then?",\n      "suggestionMax": "This class is able to (in-)directly execute too many methods. This is a typical smell for a god class. Does your class have one main functionality? Can some functionalities be extracted into other existing or new classes?"\n    },\n    "wmcThreshold": {\n      "min": 0,\n      "max": 100,\n      "noMax": false,\n      "suggestionMin": "This class contains too few or zero methods. Is this class even necessary then?",\n      "suggestionMax": "This class contains too many methods. This is a typical smell for a god class. Does your class have one main functionality? Can some functionalities be extracted into other existing or new classes?"\n    },\n    "includeCallsToJdk": false,\n    "includeOnlyPublicClasses": false\n  }\n}';
    }

    
    //-[GENERATED CONFIGURATION]------------------------------------------------------------

    public initConfigResult(): void {
        const resultContainer: HTMLTextAreaElement = document.querySelector(".overview_result textarea.boxContainer") as HTMLTextAreaElement;
        resultContainer.value = this.DEFAULT_RESULT;
    }

    public saveResultToClipboard(){
        const resultContainer: HTMLTextAreaElement = document.querySelector(".overview_result textarea.boxContainer") as HTMLTextAreaElement;
        navigator.clipboard.writeText("qf.mass = "+resultContainer.value)
        .then(() => {
            if(resultContainer.value == this.DEFAULT_RESULT){
                new Notifier().notif("The default configuration was copied to the clipboard without modification.");
            }else{
                new Notifier().notif(`The generated Configuration was copied to clipboard.`);
            }
        })
        .catch((error) => {
            console.error(`Could not copy text: ${error}`);
        });
    }


    //-[AUTOCONFIGURATOR]------------------------------------------------------------
    public resetAutoConfigurator(){
        //reset autoconfigurator
    }


    //-[PROJECT STRUCTUR]------------------------------------------------------------

    //- HTML File Upload using Drag & Drop

    // TODO Function to unzip archive
    public unpackArchive(){

    }

    // TODO Function to search comments > keywords inside comments > next instruction's line
    public searchMassKeysRanges(){

    }

    //TODO Function to update file structur
    public updateFileStructur(){

    }

    // TODO Function to generate the configuration
    public buildConfig(){

    }

    // TODO Function to handle file drop event
    public handleFileDrop(event: DragEvent) {
        event.preventDefault();
        const dropArea =  document.querySelector(".overview_form .boxUpload");
        const fileList = document.getElementById("file-list");
        // Highlight the drop area
        dropArea.classList.add("highlight");
        // Get the files from the event
        const files = event.dataTransfer.files;

        if(files.length == 1 && files[0].name.endsWith('.zip')){
            //TODO if zip : ask decompression ? || ask upload as unique file ?
            return;
        }

        //TODO create file structur
        this.updateFileStructur();

        //TODO search comments > search keywords > generate config
        this.buildConfig();

        //TODO generate config
        // Display the file names
        for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const listItem = document.createElement("li");
        listItem.textContent = file.name;
        fileList.appendChild(listItem);
        }
        alert( (document.getElementById("projectFile") as HTMLInputElement).value);
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

    public resetProjectStructur(){
        //reset project structur
    }

    //-[APP]------------------------------------------------------------
    public resetApp(){
        this.resetProjectStructur();
        this.resetAutoConfigurator();
        this.initConfigResult();
    }

    public initApp(){

        //-[DOM LOADED]------------------------------------------------------------
        window.addEventListener("DOMContentLoaded", (event) => {

            this.initConfigResult();

            // Add event listeners to the drop area
            const dropArea =  document.querySelector(".overview_form .boxUpload");
            dropArea.addEventListener("drop", this.handleFileDrop);
            dropArea.addEventListener("dragover", this.handleFileDragOver);
            dropArea.addEventListener("dragleave", this.handleFileDragLeave);

            //onclick button reset : resetApp()

            //Copy the result when the button is clicked: Save the result to the clipboard
            document.querySelector(".overview_result .tab_head_options .uil-copy").addEventListener('click', this.saveResultToClipboard);

        });
    }
}