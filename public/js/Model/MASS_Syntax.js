import { Level } from "./DataStructurs/Level.js";
var MASS_Syntax = (function () {
    function MASS_Syntax(level) {
        this.level = Level.BEGINNER;
        this.level = level !== undefined ? level : Level.BEGINNER;
    }
    MASS_Syntax.prototype.getLevel = function () {
        return this.level;
    };
    MASS_Syntax.prototype.setLevel = function (level) {
        this.level = level;
    };
    MASS_Syntax.prototype.getDefault_massSyntax = function () {
        return '\n  "syntax": {\n    "level": "BEGINNER"\n  },';
    };
    return MASS_Syntax;
}());
export default MASS_Syntax;
