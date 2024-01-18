var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import MASSHandler from "./MASSHandler.js";
import CheckerCoverageFeedback from "../Model/CheckerCoverageFeedback.js";
import MASS_CheckerCoverage from "../Model/MASS_CheckerCoverage.js";
import LineRanges from "../Model/DataStructurs/LineRanges.js";
import { readFile } from "./Helper.js";
var Control_MASS_CheckerCoverage = (function (_super) {
    __extends(Control_MASS_CheckerCoverage, _super);
    function Control_MASS_CheckerCoverage(showTestFailures, showFullCoverageReport, feedback) {
        var showTestFailuresParent = showTestFailures !== undefined ? showTestFailures : true;
        var showFullCoverageReportParent = showFullCoverageReport !== undefined ? showFullCoverageReport : false;
        var feedbackParent = feedback !== undefined ? feedback : [];
        return _super.call(this, showTestFailuresParent, showFullCoverageReportParent, feedbackParent) || this;
    }
    Control_MASS_CheckerCoverage.prototype.buildConfigFromJavaFile = function (file, fileContent, isReplacingOld) {
        var keyWordStartCov = '@mass_cvStart(';
        var keyWordEndCov = '@mass_cvEnd(';
        var lines = fileContent.split('\n');
        for (var lineNumber = 0; lineNumber < lines.length; lineNumber++) {
            var line = lines[lineNumber];
            if (line.includes('//')) {
                if (line.includes(keyWordStartCov)) {
                    var feedbackPart = this.extractFeedbackPart(lines, line, "//", lineNumber, lineNumber);
                    if (this.feedback[feedbackPart[0]] !== undefined) {
                        this.feedback[feedbackPart[0]].lineRanges.push(new LineRanges(feedbackPart[4]));
                    }
                    else {
                        this.feedback[feedbackPart[0]] = new CheckerCoverageFeedback(feedbackPart[0], file.name, feedbackPart[2], [new LineRanges(feedbackPart[4])], feedbackPart[1], feedbackPart[3]);
                    }
                }
                if (line.includes(keyWordEndCov)) {
                    var startParams = line.substring(line.indexOf(keyWordEndCov));
                    startParams = startParams.substring(startParams.indexOf('"') + 1);
                    var msgId = startParams.substring(0, startParams.lastIndexOf(')') - 1);
                    while (msgId.lastIndexOf(')') >= 0) {
                        if (msgId.lastIndexOf(')') != msgId.lastIndexOf('\)') + 1) {
                            msgId = msgId.substring(0, msgId.lastIndexOf(')') - 1);
                            msgId = msgId.substring(0, msgId.lastIndexOf('"') - 1);
                        }
                        else
                            break;
                    }
                    var previousInstructionLine = line.trim().startsWith('//') ? lineNumber : lineNumber + 1;
                    while (previousInstructionLine != lineNumber && previousInstructionLine > 0) {
                        if (lines[previousInstructionLine].trim() != '')
                            break;
                        previousInstructionLine--;
                    }
                    if (this.feedback.hasOwnProperty(msgId)) {
                        for (var i = this.feedback[msgId].lineRanges.length - 1; i >= 0; i--) {
                            if ((this.feedback[msgId].lineRanges)[i].getEnd() == null) {
                                this.feedback[msgId].lineRanges[i].setEnd(previousInstructionLine);
                                break;
                            }
                        }
                    }
                }
            }
            else if (line.includes('/*')) {
                var endCommentLineNumber = lineNumber;
                var comment = "";
                for (var lookingLineNber = lineNumber; lines.length; lookingLineNber++) {
                    comment += lines[lookingLineNber];
                    if (lines[lookingLineNber].includes('*/')) {
                        endCommentLineNumber = lookingLineNber;
                        break;
                    }
                }
                comment = comment.substring(comment.indexOf('/*'), comment.lastIndexOf('*/') + 2);
                if (comment.includes(keyWordStartCov)) {
                    if (comment.includes(keyWordStartCov)) {
                        var feedbackPart = this.extractFeedbackPart(lines, comment, "/*", lineNumber, endCommentLineNumber);
                        if (this.feedback[feedbackPart[0]] !== undefined) {
                            this.feedback[feedbackPart[0]].lineRanges.push(new LineRanges(feedbackPart[4]));
                        }
                        else {
                            this.feedback[feedbackPart[0]] = new CheckerCoverageFeedback(feedbackPart[0], file.name, feedbackPart[2], [new LineRanges(feedbackPart[4])], feedbackPart[1], feedbackPart[3]);
                        }
                    }
                }
                if (comment.includes(keyWordEndCov)) {
                    var startParams = comment.substring(comment.indexOf(keyWordEndCov));
                    startParams = startParams.substring(startParams.indexOf('"') + 1);
                    var msgId = startParams.substring(0, startParams.lastIndexOf(')') - 1);
                    while (msgId.lastIndexOf(')') >= 0) {
                        if (msgId.lastIndexOf(')') != msgId.lastIndexOf('\)') + 1) {
                            msgId = msgId.substring(0, msgId.lastIndexOf(')') - 1);
                            msgId = msgId.substring(0, msgId.lastIndexOf('"') - 1);
                        }
                        else
                            break;
                    }
                    var previousInstructionLine = line.trim().startsWith('/*') ? lineNumber : lineNumber + 1;
                    while (previousInstructionLine != lineNumber && previousInstructionLine > 0) {
                        if (lines[previousInstructionLine].trim() != '')
                            break;
                        previousInstructionLine--;
                    }
                    if (this.feedback.hasOwnProperty(msgId)) {
                        for (var i = this.feedback[msgId].lineRanges.length - 1; i >= 0; i++) {
                            if ((this.feedback[msgId].lineRanges)[i].getEnd() == null) {
                                this.feedback[msgId].lineRanges[i].setEnd(previousInstructionLine);
                                break;
                            }
                        }
                    }
                }
            }
        }
        for (var fbKey in this.feedback) {
            var highestRangesEnds = null;
            for (var j = 0; j < this.feedback[fbKey].lineRanges.length; j++) {
                var currentRangeEnd = ((this.feedback[fbKey]).lineRanges[j]).getEnd();
                var currentRangeStart = ((this.feedback[fbKey]).lineRanges[j]).getStart();
                if (highestRangesEnds != null) {
                    if (currentRangeStart <= highestRangesEnds || (currentRangeEnd != null && currentRangeEnd <= highestRangesEnds)) {
                        this.feedback[fbKey].lineRanges.splice(j, 1);
                    }
                }
                else {
                    highestRangesEnds = currentRangeEnd;
                }
            }
        }
        this.updateResult(isReplacingOld);
    };
    Control_MASS_CheckerCoverage.prototype.buildConfigFromJavaFiles = function (files, isToUnpack, isReplacingOld) {
        return __awaiter(this, void 0, void 0, function () {
            var cc, isStillReplacingOld, relativePaths, currentFiles, fileIndex, i, fileContent, error_1, _loop_1, _i, files_1, file, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cc = new Control_MASS_CheckerCoverage();
                        isStillReplacingOld = isReplacingOld;
                        relativePaths = [];
                        currentFiles = [];
                        fileIndex = 0;
                        if (!isToUnpack) return [3, 8];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        files.forEach(function (relativePath, currentFile) {
                            relativePaths[fileIndex] = relativePath;
                            currentFiles[fileIndex] = currentFile;
                            fileIndex++;
                        });
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < fileIndex)) return [3, 5];
                        if (relativePaths[i].includes("/.") || currentFiles[i].dir) {
                            i = i + 1;
                        }
                        if (!(i < fileIndex && currentFiles[i].name.endsWith(".java"))) return [3, 4];
                        return [4, files.file(currentFiles[i].name).async("string")];
                    case 3:
                        fileContent = _a.sent();
                        cc.buildConfigFromJavaFile(currentFiles[i], fileContent, isStillReplacingOld);
                        isStillReplacingOld = true;
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3, 2];
                    case 5: return [3, 7];
                    case 6:
                        error_1 = _a.sent();
                        console.error('Error:', error_1);
                        return [3, 7];
                    case 7: return [3, 14];
                    case 8:
                        _a.trys.push([8, 13, , 14]);
                        _loop_1 = function (file) {
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!(file.type == "text/x-java-source" || file.name.endsWith(".java"))) return [3, 2];
                                        return [4, readFile(file)
                                                .then(function (fileContent) {
                                                _this.buildConfigFromJavaFile(file, fileContent, isStillReplacingOld);
                                                isStillReplacingOld = true;
                                            })];
                                    case 1:
                                        _b.sent();
                                        _b.label = 2;
                                    case 2: return [2];
                                }
                            });
                        };
                        _i = 0, files_1 = files;
                        _a.label = 9;
                    case 9:
                        if (!(_i < files_1.length)) return [3, 12];
                        file = files_1[_i];
                        return [5, _loop_1(file)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        _i++;
                        return [3, 9];
                    case 12: return [3, 14];
                    case 13:
                        error_2 = _a.sent();
                        console.error('Error:', error_2);
                        return [3, 14];
                    case 14: return [2];
                }
            });
        });
    };
    Control_MASS_CheckerCoverage.prototype.updateResult_testFailures = function (showTestFailures) {
        var resultContainer = document.querySelector(".overview_result textarea.boxContainer");
        var resultTxt = JSON.parse(resultContainer.value);
        resultTxt["coverage"]["showTestFailures"] = showTestFailures;
        resultContainer.value = new MASSHandler().formatConfigResult(JSON.stringify(resultTxt), 1);
    };
    Control_MASS_CheckerCoverage.prototype.updateResult_testFullReport = function (showFullCoverageReport) {
        var resultContainer = document.querySelector(".overview_result textarea.boxContainer");
        var resultTxt = JSON.parse(resultContainer.value);
        resultTxt["coverage"]["showFullCoverageReport"] = showFullCoverageReport;
        resultContainer.value = new MASSHandler().formatConfigResult(JSON.stringify(resultTxt), 1);
    };
    Control_MASS_CheckerCoverage.prototype.updateResult = function (isReplacingOld) {
        this.showTestFailures = document.getElementById("test_failures").checked;
        this.showFullCoverageReport = document.getElementById("test_full_report").checked;
        var resultContainer = document.querySelector(".overview_result textarea.boxContainer");
        var resultTxt = JSON.parse(resultContainer.value);
        this.updateResult_testFailures(this.showTestFailures);
        this.updateResult_testFullReport(this.showFullCoverageReport);
        if (isReplacingOld) {
            var coverageString = this.getStringCoverageConfig().split("\n").join("");
            coverageString = coverageString.substring(coverageString.indexOf(":") + 1);
            coverageString = coverageString.substring(0, coverageString.lastIndexOf(","));
            coverageString.trim();
            resultTxt["coverage"] = JSON.parse(coverageString);
        }
        else {
            resultTxt["coverage"]["feedback"].push(JSON.parse(this.getStringFeedbackConfig()));
        }
        resultTxt["coverageSelected"] = true;
        resultContainer.value = new MASSHandler().formatConfigResult(JSON.stringify(resultTxt), 1);
    };
    return Control_MASS_CheckerCoverage;
}(MASS_CheckerCoverage));
export default Control_MASS_CheckerCoverage;
