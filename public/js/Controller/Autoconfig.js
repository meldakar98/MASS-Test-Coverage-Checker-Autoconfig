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
import Notifier from "./Notifier.js";
import JSDragDropTree from "./JSDragDropTree.js";
import Control_MASS_CheckerCoverage from "./Control_MASS_CheckerCoverage.js";
import MASSHandler from "./MASSHandler.js";
import Control_MASS_Syntax from "./Control_MASS_Syntax.js";
import { Level } from "../Model/DataStructurs/Level.js";
import { calculateTxtFileWeight } from "./Helper.js";
import { getParsedDate } from "./Helper.js";
import { downloadZipFile } from "./Helper.js";
import { isEqualJSON } from "./Helper.js";
var Autoconfig = (function () {
    function Autoconfig() {
        this.subfolder = [];
        this.DEFAULT_RESULT = new MASSHandler().getDefault_massFullConfig();
    }
    Autoconfig.prototype.initConfigResult = function () {
        var resultContainer = document.querySelector(".overview_result textarea.boxContainer");
        resultContainer.value = this.DEFAULT_RESULT;
    };
    Autoconfig.prototype.saveResultToClipboard = function () {
        var _this = this;
        var resultContainer = document.querySelector(".overview_result textarea.boxContainer");
        navigator.clipboard.writeText("qf.mass = " + (resultContainer.value).split("\n").join(""))
            .then(function () {
            if (resultContainer.value == _this.DEFAULT_RESULT) {
                new Notifier().notif("<h2>Configurations Copy</h2> <p>The default configuration was copied to the clipboard without modification.</p>");
            }
            else {
                new Notifier().notif("<h2>Configurations Copy</h2> <p>The generated Configuration was copied to clipboard.</p>");
            }
        })
            .catch(function (error) {
            console.error("Could not paste text from clipboard : ".concat(error));
        });
    };
    Autoconfig.prototype.addResultFromClipboard = function () {
        var resultContainer = document.querySelector(".overview_result textarea.boxContainer");
        navigator.clipboard.readText()
            .then(function (text) {
            var CONFIG_OBJECT_NAME = "qf.mass";
            var massHandler = new MASSHandler();
            var parsedConfig = text.trim().split("\n").join("");
            parsedConfig = text.trim().split("\t").join("");
            parsedConfig = text.trim().split("\r").join("");
            if (parsedConfig.startsWith(CONFIG_OBJECT_NAME)) {
                parsedConfig = text.substring(parsedConfig.indexOf("=") + 1);
                parsedConfig = parsedConfig.trim();
            }
            var jsonParsedConfig = JSON.parse(parsedConfig);
            var jsonDefault = JSON.parse(massHandler.getDefault_massFullConfig());
            if (massHandler.isCorrectConfigSkeleton(parsedConfig)) {
                var currentConfig = resultContainer.value;
                var jsonCurrentConfig = JSON.parse(currentConfig);
                jsonParsedConfig["syntax"] = jsonCurrentConfig["syntax"];
                jsonParsedConfig["coverageSelected"] = true;
                jsonParsedConfig["coverage"] = jsonCurrentConfig["coverage"];
                resultContainer.value = massHandler.formatConfigResult(JSON.stringify(jsonParsedConfig), 1);
                new Autoconfig().updateResultWeight();
                if (isEqualJSON(jsonParsedConfig, jsonDefault)) {
                    new Notifier().notif("<h2>Configurations Paste</h2> <p>The pasting configuration is the default configuration</p>");
                }
                else {
                    new Notifier().notif("<h2>Configurations Paste</h2> <p>The generated Configuration was partially copied from clipboard. </p>");
                }
            }
            else {
                new Notifier().notif("<h2>Error</h2> <p>The text copied in clipboard is not a valid text for the configurator. </p>");
            }
        })
            .catch(function (error) {
            new Notifier().notif("<h2>Error</h2> <p> Could not paste configuration.</p><p> ".concat(error, " </p>"));
        });
    };
    Autoconfig.prototype.downloadConfig = function () {
        try {
            var textareaResult = document.querySelector("textarea.boxContainer");
            var blob = new Blob([textareaResult.value], { type: "application/json" });
            var link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "massConfig.json";
            link.click();
        }
        catch (error) {
            console.error("Download failed : ".concat(error));
        }
    };
    Autoconfig.prototype.resetAutoConfigurator = function () {
        var inputFields = document.querySelectorAll("input[type=file]");
        inputFields.forEach(function (input) {
            input.value = '';
        });
        document.getElementById("syntaxLevel").value = Level[Level.BEGINNER];
        document.getElementById("test_failures").checked = true;
        document.getElementById("test_full_report").checked = false;
        this.subfolder = [];
        this.DEFAULT_RESULT = new MASSHandler().getDefault_massFullConfig();
    };
    Autoconfig.prototype.updateAllStates = function () {
    };
    Autoconfig.prototype.updateStatesFromSpecInput = function (specInput, isToUnpack, isReplacingOld) {
        var autoconfig = new Autoconfig();
        autoconfig.updateFileStructurFromSpecInput(specInput, isToUnpack);
        if (isToUnpack) {
            if (specInput.files[0].name.endsWith('.zip')) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    var data = event.target.result;
                    JSZip.loadAsync(data).then(function (zipData) {
                        autoconfig.buildConfig(zipData, isToUnpack, isReplacingOld);
                    });
                };
                reader.readAsArrayBuffer(specInput.files[0]);
            }
        }
        else {
            autoconfig.buildConfig(specInput.files, isToUnpack, isReplacingOld);
        }
    };
    Autoconfig.prototype.unpackArchive = function (file) {
        var folderStructure = document.getElementById('filehierarchy_tree');
        var autoconfig = new Autoconfig();
        if (file.name.endsWith('.zip')) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var data = event.target.result;
                JSZip.loadAsync(data).then(function (zipData) {
                    autoconfig.displayFolderStructure(zipData, folderStructure);
                });
            };
            reader.readAsArrayBuffer(file);
        }
        else {
            new Notifier().notif('<h2>File Upload</h2> <p>Please select a Zip file.</p>');
        }
    };
    Autoconfig.prototype.displayFolderStructure = function (folder, parentElement) {
        var _this = this;
        folder.forEach(function (relativePath, file) {
            if (relativePath.includes("/.")) {
                return;
            }
            var trueParent = parentElement;
            var folderPrepared = relativePath.endsWith("/") ? relativePath.substring(0, relativePath.length - 1) : relativePath;
            var lastIndexSlash = folderPrepared.lastIndexOf("/");
            var folderName = lastIndexSlash > -1 ? folderPrepared.substring(lastIndexSlash + 1) : folderPrepared;
            var folderParent = lastIndexSlash > -1 ? folderPrepared.substring(0, lastIndexSlash + 1) : "";
            if (folderParent != "" && _this.subfolder[folderParent] !== undefined) {
                trueParent = document.getElementById(_this.subfolder[folderParent]).getElementsByTagName("ul")[0];
            }
            if (file.dir) {
                var folderElement = document.createElement('li');
                var folderId = "node" + Date.now().toString() + "_" + Math.round(Math.random() * 100);
                folderElement.id = folderId;
                var listItemAnchor = document.createElement("a");
                listItemAnchor.innerText = folderName;
                folderElement.appendChild(listItemAnchor);
                var subFolderElement = document.createElement('ul');
                folderElement.appendChild(subFolderElement);
                _this.subfolder[relativePath] = folderId;
                trueParent.appendChild(folderElement);
            }
            else {
                var fileElement = document.createElement('li');
                var fileElementAnchor = document.createElement("a");
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
            }
        });
        var treeObj = new JSDragDropTree();
        treeObj.setTreeId('filehierarchy_tree');
        treeObj.setMaximumDepth(7);
        treeObj.setMessageMaximumDepthReached('Maximum depth reached');
        treeObj.initTree();
    };
    Autoconfig.prototype.updateAllFileStructur = function () {
    };
    Autoconfig.prototype.updateFileStructurFromSpecInput = function (specInput, isToUnpack) {
        var autoconfig = new Autoconfig();
        var dropBox = document.querySelector("div.overview_form div.boxUpload");
        var fileStructureBox = document.querySelector("div.overview_form div.boxContainer");
        var fileTreeTop = document.getElementById("filehierarchy_tree");
        dropBox.classList.add("none");
        fileStructureBox.classList.remove("none");
        if (isToUnpack) {
            autoconfig.unpackArchive(specInput.files[0]);
        }
        else {
            for (var i = 0; i < specInput.files.length; i++) {
                var listItem = document.createElement("li");
                var listItemAnchor = document.createElement("a");
                listItem.id = "node" + Date.now().toString();
                listItem.classList.add("filehierarchy_endNode");
                listItem.setAttribute("noDrag", "false");
                listItem.setAttribute("noSiblings", "false");
                listItem.setAttribute("noDelete", "false");
                listItem.setAttribute("noRename", "false");
                listItem.setAttribute("noChildren", "true");
                listItemAnchor.innerText = specInput.files[i].name;
                listItem.appendChild(listItemAnchor);
                fileTreeTop.appendChild(listItem);
            }
        }
        var treeObj = new JSDragDropTree();
        treeObj.setTreeId('filehierarchy_tree');
        treeObj.setMaximumDepth(7);
        treeObj.setMessageMaximumDepthReached('Maximum depth reached');
        treeObj.initTree();
    };
    Autoconfig.prototype.buildConfig = function (files, isToUnpack, isReplacingOld) {
        if (isReplacingOld === void 0) { isReplacingOld = true; }
        return __awaiter(this, void 0, void 0, function () {
            var autoconfig;
            return __generator(this, function (_a) {
                autoconfig = new Autoconfig();
                new Control_MASS_CheckerCoverage().buildConfigFromJavaFiles(files, isToUnpack, isReplacingOld).then(autoconfig.updateResultWeight);
                return [2];
            });
        });
    };
    Autoconfig.prototype.buildConfigWholeConfig = function () {
    };
    Autoconfig.prototype.startFirstStepUpload = function (currentInputFile, isReplacingOld) {
        return __awaiter(this, void 0, void 0, function () {
            var autoconfig, files, notifier, prepNotif, btnUnzip, btnOnlyUpload;
            return __generator(this, function (_a) {
                autoconfig = new Autoconfig();
                files = currentInputFile.files;
                if (isReplacingOld) {
                    autoconfig.resetResult();
                }
                if (files.length == 1 && files[0].name.endsWith('.zip')) {
                    notifier = new Notifier();
                    prepNotif = '<h3> Archive Upload </h3> ' +
                        '<p> Does the archive file need to be unzipped before adding to the project? </p> <br/> ' +
                        '<p> <button id="btnUnzipUploading">yes</button> <button id="btnKeepUploading">no</button> </p> ';
                    notifier.notif(prepNotif);
                    btnUnzip = document.getElementById("btnUnzipUploading");
                    btnUnzip.addEventListener("click", function () {
                        autoconfig.updateStatesFromSpecInput(currentInputFile, true, isReplacingOld);
                        notifier.removeNotif(true);
                    });
                    btnOnlyUpload = document.getElementById("btnKeepUploading");
                    btnOnlyUpload.addEventListener("click", function () {
                        autoconfig.updateStatesFromSpecInput(currentInputFile, false, isReplacingOld);
                        notifier.removeNotif(true);
                    });
                    return [2];
                }
                autoconfig.updateStatesFromSpecInput(currentInputFile, false, isReplacingOld);
                return [2];
            });
        });
    };
    Autoconfig.prototype.configFromUrl = function () {
        var inputSearchUrl = document.getElementById("searchUrlZip");
        if (inputSearchUrl.value == "") {
            inputSearchUrl.focus();
            return;
        }
        var inputFieldId = "projectFile";
        var inputField = document.getElementById(inputFieldId);
        downloadZipFile(inputSearchUrl.value, inputFieldId)
            .then(function () {
            new Autoconfig().startFirstStepUpload(inputField, true);
        })
            .catch(function (error) {
            new Notifier().notif("<h3> ERROR </h3> <p> ".concat(error, " </p> <br/>"));
        });
    };
    Autoconfig.prototype.handleFileDrop = function (event) {
        event.preventDefault();
        var autoconfig = new Autoconfig();
        var dropArea = document.querySelector(".overview_form .boxUpload");
        var currentInputFile = document.getElementById("projectFile");
        dropArea.classList.add("highlight");
        var files = event.dataTransfer.files;
        currentInputFile.files = files;
        autoconfig.startFirstStepUpload(currentInputFile, true).then(autoconfig.updateResultWeight);
    };
    Autoconfig.prototype.handleFileDragOver = function (event) {
        event.preventDefault();
    };
    Autoconfig.prototype.handleFileDragLeave = function (event) {
        var dropArea = document.querySelector(".overview_form .boxUpload");
        dropArea.classList.remove("highlight");
    };
    Autoconfig.prototype.resetProjectStructur = function () {
        document.getElementById("filehierarchy_tree").innerHTML = "";
        var dropBoxP = document.querySelector("div.overview_form div.boxUpload");
        var fileStructureBoxP = document.querySelector("div.overview_form div.boxContainer");
        fileStructureBoxP.classList.add("none");
        dropBoxP.classList.remove("none");
    };
    Autoconfig.prototype.updateResultWeight = function () {
        var textareaResult = document.querySelector("textarea.boxContainer");
        var resultWeightHtml = document.getElementById("resultWeight");
        if (textareaResult.value == new MASSHandler().getDefault_massFullConfig()) {
            resultWeightHtml.innerHTML = "<li> <em> Default Configuration </em> </li>";
        }
        else {
            resultWeightHtml.innerHTML =
                "<li><em> Updated at: " + getParsedDate() + " </em></li>" +
                    "<li><em> File weight: " + calculateTxtFileWeight(textareaResult.value, 2) + " Ko </em></li>";
        }
    };
    Autoconfig.prototype.resetResult = function (isConservingConfig) {
        if (isConservingConfig === void 0) { isConservingConfig = true; }
        var autoconfig = new Autoconfig();
        autoconfig.resetProjectStructur();
        this.subfolder = [];
        this.DEFAULT_RESULT = new MASSHandler().getDefault_massFullConfig();
        autoconfig.initConfigResult();
        if (isConservingConfig) {
            var selectLevel = document.getElementById("syntaxLevel");
            var syntaxLevel = selectLevel.value == "ADVANCED" ? Level.ADVANCED : Level.BEGINNER;
            new Control_MASS_Syntax(syntaxLevel).updateResult();
            var mass_CheckerCoverage = new Control_MASS_CheckerCoverage();
            var selectTestFailures = document.getElementById("test_failures");
            mass_CheckerCoverage.updateResult_testFailures(selectTestFailures.checked);
            var selectFullCovReport = document.getElementById("test_full_report");
            mass_CheckerCoverage.updateResult_testFullReport(selectFullCovReport.checked);
        }
        else {
            autoconfig.resetAutoConfigurator();
        }
        autoconfig.updateResultWeight();
    };
    Autoconfig.prototype.resetApp = function () {
        var autoconfig = new Autoconfig();
        autoconfig.resetProjectStructur();
        autoconfig.resetAutoConfigurator();
        autoconfig.initConfigResult();
        autoconfig.updateResultWeight();
        new Notifier().notif("<h2>Reset Configurator</h2> <p>The Configurator have been reseted </p>");
    };
    Autoconfig.prototype.refreshAppp = function () {
        var autoconfig = new Autoconfig();
        autoconfig.updateAllFileStructur();
        autoconfig.buildConfigWholeConfig();
        new Notifier().notif("<h2>Update Results</h2> <p>The results are now up to date </p>");
    };
    Autoconfig.prototype.initApp = function () {
        var _this = this;
        window.addEventListener("DOMContentLoaded", function (event) {
            _this.initConfigResult();
            var dropArea = document.querySelector(".overview_form .boxUpload");
            dropArea.addEventListener("drop", _this.handleFileDrop);
            dropArea.addEventListener("dragover", _this.handleFileDragOver);
            dropArea.addEventListener("dragleave", _this.handleFileDragLeave);
            document.querySelector(".overview_form .uil-file-upload").addEventListener('click', function () {
                document.getElementById("projectFile").click();
            });
            document.querySelector(".overview_form .uil-folder-plus").addEventListener('click', function () {
                document.getElementById("othersProjectFile1").click();
            });
            document.querySelector("div.overview_result div.buttons button.reset").addEventListener('click', _this.resetApp);
            document.querySelector(".overview_result .tab_head_options .uil-refresh").addEventListener('click', _this.refreshAppp);
            document.querySelector(".overview_result .tab_head_options .uil-copy").addEventListener('click', _this.saveResultToClipboard);
            document.querySelector(".overview_result .tab_head_options .uil-file-edit").addEventListener('click', _this.addResultFromClipboard);
            document.querySelector("#downloadConfig").addEventListener('click', _this.downloadConfig);
            var inputFile0 = document.getElementById("projectFile");
            inputFile0.addEventListener("change", function () {
                _this.startFirstStepUpload(inputFile0, true);
            });
            var inputFileFolder = document.getElementById("othersProjectFile1");
            inputFileFolder.addEventListener("change", function () {
                _this.startFirstStepUpload(inputFileFolder, true);
            });
            var selectLevel = document.getElementById("syntaxLevel");
            selectLevel.addEventListener("change", function () {
                var syntaxLevel = selectLevel.value == "ADVANCED" ? Level.ADVANCED : Level.BEGINNER;
                new Control_MASS_Syntax(syntaxLevel).updateResult();
                _this.updateResultWeight();
            });
            var selectTestFailures = document.getElementById("test_failures");
            selectTestFailures.addEventListener("change", function () {
                new Control_MASS_CheckerCoverage().updateResult_testFailures(selectTestFailures.checked);
                _this.updateResultWeight();
            });
            var selectFullCovReport = document.getElementById("test_full_report");
            selectFullCovReport.addEventListener("change", function () {
                new Control_MASS_CheckerCoverage().updateResult_testFullReport(selectFullCovReport.checked);
                _this.updateResultWeight();
            });
            document.querySelector(".overview_form .uil-search-plus").addEventListener('click', _this.configFromUrl);
            var inputSearchUrl = document.getElementById("searchUrlZip");
            inputSearchUrl.addEventListener("keypress", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    new Autoconfig().configFromUrl();
                }
            });
        });
    };
    return Autoconfig;
}());
export default Autoconfig;
