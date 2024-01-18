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
import { Level } from "../Model/DataStructurs/Level.js";
import MASS_Syntax from "../Model/MASS_Syntax.js";
import MASSHandler from "./MASSHandler.js";
var Control_MASS_Syntax = (function (_super) {
    __extends(Control_MASS_Syntax, _super);
    function Control_MASS_Syntax(level) {
        var levelParent = level !== undefined ? level : Level.BEGINNER;
        return _super.call(this, levelParent) || this;
    }
    Control_MASS_Syntax.prototype.updateResult = function () {
        var resultContainer = document.querySelector(".overview_result textarea.boxContainer");
        var resultJson = JSON.parse(resultContainer.value);
        resultJson["syntax"]["level"] = Level[_super.prototype.getLevel.call(this)];
        resultContainer.value = new MASSHandler().formatConfigResult(JSON.stringify(resultJson), 1);
    };
    return Control_MASS_Syntax;
}(MASS_Syntax));
export default Control_MASS_Syntax;
