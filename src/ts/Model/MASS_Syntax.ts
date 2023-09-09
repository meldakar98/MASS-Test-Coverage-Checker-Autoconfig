import {Level} from "./DataStructurs/Level.js";

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

}