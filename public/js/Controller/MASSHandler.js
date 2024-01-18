import MASS_Syntax from "../Model/MASS_Syntax.js";
import MASS_CheckerStyle from "../Model/MASS_CheckerStyle.js";
import MASS_CheckerSemantic from "../Model/MASS_CheckerSemantic.js";
import MASS_CheckerCoverage from "../Model/MASS_CheckerCoverage.js";
import MASS_CheckerClass from "../Model/MASS_CheckerClass.js";
import MASS_CheckerMetric from "../Model/MASS_CheckerMetric.js";
import { isCorrectJsonSkeleton } from "./Helper.js";
var MASSHandler = (function () {
    function MASSHandler(styleSelected, semanticSelected, coverageSelected, classSelected, metricsSelected) {
        this.styleSelected = false;
        this.semanticSelected = false;
        this.coverageSelected = true;
        this.classSelected = false;
        this.metricsSelected = false;
        this.styleSelected = styleSelected !== undefined ? styleSelected : false;
        this.semanticSelected = semanticSelected !== undefined ? semanticSelected : false;
        this.coverageSelected = coverageSelected !== undefined ? coverageSelected : true;
        this.classSelected = classSelected !== undefined ? classSelected : false;
        this.metricsSelected = metricsSelected !== undefined ? metricsSelected : false;
    }
    MASSHandler.prototype.getDefault_massFullConfig = function () {
        var syntax = new MASS_Syntax();
        var style = new MASS_CheckerStyle();
        var semantic = new MASS_CheckerSemantic();
        var coverage = new MASS_CheckerCoverage();
        var checkerclass = new MASS_CheckerClass();
        var metric = new MASS_CheckerMetric();
        return '{' +
            syntax.getDefault_massSyntax() +
            this.getDefault_massSelected() +
            style.getDefault_massStyle() +
            semantic.getDefault_massSemantic() +
            coverage.getStringCoverageConfig() +
            checkerclass.getDefault_massClass() +
            metric.getDefault_massMetric() +
            '}';
    };
    MASSHandler.prototype.getDefault_massSelected = function () {
        return '\n  "styleSelected": ' + this.styleSelected.toString() + ',\n  "semanticSelected": ' + this.semanticSelected.toString() + ',\n  "coverageSelected": ' + this.coverageSelected.toString() + ',\n  "classSelected": ' + this.classSelected.toString() + ',\n  "metricsSelected": ' + this.metricsSelected.toString() + ',';
    };
    MASSHandler.prototype.isCorrectConfigSkeleton = function (configTxt) {
        return isCorrectJsonSkeleton(configTxt, this.getDefault_massFullConfig());
    };
    MASSHandler.prototype.formatConfigResult = function (configTxt, numberSpaces, isSpaceStart) {
        if (isSpaceStart === void 0) { isSpaceStart = false; }
        var space_default = ' ';
        var space = ' ';
        for (var i = 0; i < numberSpaces; i++) {
            space += space;
        }
        var jsonConfig = JSON.parse(configTxt);
        var keysConfig = Object.keys(jsonConfig);
        var result = isSpaceStart ? space.substring(space_default.length) + '{' : '{';
        var indexParam = 1;
        for (var _i = 0, keysConfig_1 = keysConfig; _i < keysConfig_1.length; _i++) {
            var key = keysConfig_1[_i];
            var commaParam = indexParam < keysConfig.length ? ',' : '';
            result += '\n' + space + '"' + key + '": ';
            var currObjValue = jsonConfig[key];
            if (Array.isArray(currObjValue)) {
                result += '[\n';
                if (typeof currObjValue[0] == "object") {
                    var indexParamArr = 1;
                    for (var arrKey in currObjValue) {
                        commaParam = indexParamArr < currObjValue.length ? ',\n' : '';
                        result += this.formatConfigResult(JSON.stringify(currObjValue[arrKey]), numberSpaces + 1, true) + commaParam;
                        indexParamArr++;
                    }
                }
                result += '\n' + space + '],';
            }
            else if (typeof currObjValue === "object") {
                result += this.formatConfigResult(JSON.stringify(currObjValue), numberSpaces + 1) + commaParam;
            }
            else if (typeof currObjValue === "string") {
                result += '"' + currObjValue.split('"').join('\'') + '"' + commaParam;
            }
            else if (typeof currObjValue === "boolean") {
                result += (currObjValue ? 'true' : 'false') + commaParam;
            }
            else if (typeof currObjValue === "number") {
                result += currObjValue + commaParam;
            }
            else {
                result += '"' + currObjValue.toString() + '"' + commaParam;
            }
            indexParam++;
        }
        return result + (keysConfig.length > 0 ? '\n' + space.substring(space_default.length) + '}' : '}');
    };
    return MASSHandler;
}());
export default MASSHandler;
