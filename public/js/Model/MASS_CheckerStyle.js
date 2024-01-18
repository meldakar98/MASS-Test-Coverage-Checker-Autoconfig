import { Level } from "./DataStructurs/Level.js";
var MASS_CheckerStyle = (function () {
    function MASS_CheckerStyle() {
        this.basisLevel = Level.BEGINNER;
        this.complexityLevel = Level.BEGINNER;
        this.namesLevel = Level.BEGINNER;
        this.classLength = -1;
        this.methodLength = -1;
        this.cyclomaticComplexity = -1;
        this.fieldsCount = -1;
        this.variableNamePattern = "[a-z][a-zA-Z0-9]*";
        this.methodNamePattern = "[a-z][a-zA-Z0-9]*";
        this.methodParameterNamePattern = "[a-z][a-zA-Z0-9]*";
        this.classNamePattern = "[A-Z][a-zA-Z0-9_]*";
    }
    MASS_CheckerStyle.prototype.getDefault_massStyle = function () {
        return '\n  "style": {\n    "basisLevel": "BEGINNER",\n    "complexityLevel": "BEGINNER",\n    "namesLevel": "BEGINNER",\n    "classLength": -1,\n    "methodLength": -1,\n    "cyclomaticComplexity": -1,\n    "fieldsCount": -1,\n    "variableNamePattern": "[a-z][a-zA-Z0-9]*",\n    "methodNamePattern": "[a-z][a-zA-Z0-9]*",\n    "methodParameterNamePattern": "[a-z][a-zA-Z0-9]*",\n    "classNamePattern": "[A-Z][a-zA-Z0-9_]*"\n  },';
    };
    return MASS_CheckerStyle;
}());
export default MASS_CheckerStyle;
