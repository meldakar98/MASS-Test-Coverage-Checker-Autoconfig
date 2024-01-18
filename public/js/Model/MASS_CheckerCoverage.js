import { CoverageMiss } from "../Model/DataStructurs/CoverageMiss.js";
import CheckerCoverageFeedback from "../Model/CheckerCoverageFeedback.js";
var MASS_CheckerCoverage = (function () {
    function MASS_CheckerCoverage(showTestFailures, showFullCoverageReport, feedback) {
        this.showTestFailures = true;
        this.showFullCoverageReport = false;
        this.feedback = [];
        this.showTestFailures = showTestFailures !== undefined ? showTestFailures : true;
        this.showFullCoverageReport = showFullCoverageReport !== undefined ? showFullCoverageReport : false;
        this.feedback = feedback !== undefined ? feedback : [];
    }
    MASS_CheckerCoverage.prototype.getStringCoverageConfig = function () {
        var sFCR = this.showFullCoverageReport ? "true" : "false";
        var sTF = this.showTestFailures ? "true" : "false";
        var coverageString = '\n  "coverage": {\n    ' +
            '"feedback": [\n      ' +
            this.getStringFeedbackConfig() +
            '\n    ],\n    ' +
            '"showFullCoverageReport": ' + sFCR + ',\n    ' +
            '"showTestFailures": ' + sTF + '\n  },';
        return coverageString;
    };
    MASS_CheckerCoverage.prototype.getStringFeedbackConfig = function () {
        var fbKeys = Object.keys(this.feedback);
        var buildedFeedback = fbKeys.length > 0 ? "" : new CheckerCoverageFeedback().buildPartFeedbackBlock_empty();
        for (var fbKey in this.feedback) {
            buildedFeedback += this.feedback[fbKey].buildPartFeedbackBlock();
            buildedFeedback += fbKey == fbKeys[fbKeys.length - 1] ? "" : ",\n    ";
        }
        return buildedFeedback;
    };
    MASS_CheckerCoverage.prototype.extractFeedbackPart = function (lines, line, commentStartString, kwFirstCharLineNumber, kwLastCharLineNumber) {
        var keyWordStartCov = '@mass_cvStart(';
        var startParams = line.substring(line.indexOf(keyWordStartCov));
        startParams = startParams.substring(startParams.indexOf('"') + 1);
        var params = startParams.substring(0, startParams.lastIndexOf('"'));
        var paramsConcat = params;
        var currPartConcatParam = "";
        var arrayParams = [];
        while (paramsConcat.indexOf('",') >= 0) {
            currPartConcatParam += paramsConcat.substring(0, paramsConcat.indexOf('",'));
            if ((paramsConcat.indexOf('\",') != -1 && (paramsConcat.indexOf('",') == paramsConcat.indexOf('\",') + 1)) || (paramsConcat.indexOf('\\",') != -1 && (paramsConcat.indexOf('",') == paramsConcat.indexOf('\\",') + 2))) {
                paramsConcat = paramsConcat.substring(paramsConcat.indexOf('",') + 2);
            }
            else {
                arrayParams.push(currPartConcatParam);
                paramsConcat = paramsConcat.substring(paramsConcat.indexOf('",') + 2);
                paramsConcat = paramsConcat.substring(paramsConcat.indexOf('"') + 1);
                currPartConcatParam = "";
            }
        }
        arrayParams.push(paramsConcat);
        arrayParams[0] = arrayParams[0].replaceAll(/\s/g, '');
        arrayParams[2] = arrayParams[2].replaceAll(/\s/g, '') == CoverageMiss.FULLY_MISSED.toString() ? CoverageMiss.FULLY_MISSED : CoverageMiss.PARTIALLY_MISSED;
        arrayParams[3] = arrayParams[3].replaceAll(/\s/g, '').split(',');
        var nextInstructionLine = line.trim().startsWith(commentStartString) ? kwLastCharLineNumber + 2 : kwLastCharLineNumber + 1;
        while (nextInstructionLine != kwLastCharLineNumber && nextInstructionLine < lines.length) {
            if (lines[nextInstructionLine].trim() != '')
                break;
            nextInstructionLine++;
        }
        arrayParams.push(nextInstructionLine);
        return arrayParams;
    };
    return MASS_CheckerCoverage;
}());
export default MASS_CheckerCoverage;
