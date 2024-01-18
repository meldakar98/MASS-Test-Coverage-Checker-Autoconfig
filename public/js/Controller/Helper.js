export function readFile(file) {
    return new Promise(function (resolve, reject) {
        try {
            var reader = new FileReader();
            reader.onload = function (event) {
                var _a;
                var content = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
                resolve(content);
            };
            reader.onerror = function (event) {
                reject(new Error("Error reading file"));
            };
            reader.readAsText(file);
        }
        catch (error) {
            reject(error);
        }
    });
}
export function getPositionString(string, subString, index) {
    return string.split(subString, index).join(subString).length;
}
export function getParsedDate() {
    var parseTime = function (timeElement) {
        return timeElement < 10 ? "0" + timeElement : "" + timeElement;
    };
    var currentdate = new Date();
    var datetime = parseTime(currentdate.getDate()) + "."
        + parseTime(currentdate.getMonth() + 1) + "."
        + parseTime(currentdate.getFullYear()) + " "
        + parseTime(currentdate.getHours()) + ":"
        + parseTime(currentdate.getMinutes()) + ":"
        + parseTime(currentdate.getSeconds());
    return datetime;
}
export function calculateTxtFileWeight(text, round) {
    var bytesPerCharacter = 1;
    var totalBytes = text.length * bytesPerCharacter;
    var totalKilobytes = totalBytes / 1024;
    return Math.round(totalKilobytes * (Math.pow(10, round))) / 100;
}
export function isEqualJSON(obj1, obj2) {
    if (typeof obj1 !== "object" || typeof obj2 !== "object") {
        return false;
    }
    var keys1 = Object.keys(obj1);
    var keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (var _i = 0, keys1_1 = keys1; _i < keys1_1.length; _i++) {
        var key = keys1_1[_i];
        if (!obj2.hasOwnProperty(key)) {
            return false;
        }
        var value1 = obj1[key];
        var value2 = obj2[key];
        if (typeof value1 === "object" && typeof value2 === "object") {
            if (!isEqualJSON(value1, value2)) {
                return false;
            }
        }
        else if (value1 !== value2) {
            return false;
        }
    }
    return true;
}
export function isCorrectJsonSkeleton(configTxt, defaultTxt) {
    var jsonParsedConfig = JSON.parse(configTxt);
    var jsonDefault = JSON.parse(defaultTxt);
    var keysParsedConfig = Object.keys(jsonParsedConfig);
    var keysDefault = Object.keys(jsonDefault);
    if (keysParsedConfig.length < keysDefault.length) {
        return false;
    }
    for (var _i = 0, keysDefault_1 = keysDefault; _i < keysDefault_1.length; _i++) {
        var key = keysDefault_1[_i];
        if (!(keysParsedConfig.includes(key))) {
            return false;
        }
        var value1 = jsonParsedConfig[key];
        var value2 = jsonDefault[key];
        if (typeof value1 === "object" && typeof value2 === "object") {
            if (!isCorrectJsonSkeleton(JSON.stringify(value1), JSON.stringify(value2))) {
                return false;
            }
        }
        else if (typeof value1 !== typeof value2) {
            return false;
        }
    }
    return true;
}
export function downloadZipFile(url, inputFieldId) {
    return new Promise(function (resolve, reject) {
        if (!url || !inputFieldId) {
            reject("Invalid input. URL and input field ID are required.");
        }
        fetch(url)
            .then(function (response) {
            if (!response.ok) {
                throw new Error("Failed to download zip file. Status: ".concat(response.status, " ").concat(response.statusText));
            }
            return response.blob();
        })
            .then(function (blob) {
            var reader = new FileReader();
            reader.onload = function () {
                var fileContents = reader.result;
                var inputFile = document.getElementById(inputFieldId);
                var fileValue = new File([fileContents], "downloaded.zip");
                var dataTransfer = new DataTransfer();
                dataTransfer.items.add(fileValue);
                inputFile.files = dataTransfer.files;
                resolve();
            };
            reader.readAsArrayBuffer(blob);
        })
            .catch(function (error) {
            reject("Failed to download zip file. ".concat(error.message));
        });
    });
}
