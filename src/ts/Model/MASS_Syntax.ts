import {Level} from "./DataStructurs/Level.js";
import MASSHandler from "../Controller/MASSHandler.js";

export default class MASS_Syntax{
    level: Level = Level.BEGINNER;

    constructor(level?:Level){
        this.level = level !== undefined ? level : Level.BEGINNER;
    }

    public getLevel(): Level{
        return this.level;
    }

    public setLevel(level:Level){
        this.level = level;
    }

    public getDefault_massSyntax(): string{
        return '\n  "syntax": {\n    "level": "BEGINNER"\n  },';
    }

    public updateResult(){
        let resultContainer = document.querySelector(".overview_result textarea.boxContainer") as HTMLTextAreaElement;
        let resultJson = JSON.parse(resultContainer.value);
        resultJson["syntax"]["level"] = Level[this.level];
        resultContainer.value = new MASSHandler().formatConfigResult(JSON.stringify(resultJson), 1);
    }
}