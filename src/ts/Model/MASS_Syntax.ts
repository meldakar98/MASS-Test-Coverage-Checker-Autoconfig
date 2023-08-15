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

    public updateResult(){
        let result: string = '"syntax": {\n    "level": "'+ Level[this.level] +'"\n  },';
        let resultContainer = document.querySelector(".overview_result textarea.boxContainer") as HTMLTextAreaElement;
        let oldResult = resultContainer.value;
        let oldResultSearcher = oldResult.substring(oldResult.indexOf('"syntax"'));
        while(oldResultSearcher.indexOf('},') >= 0){
        if((oldResultSearcher.indexOf('\},')!=-1) && (oldResultSearcher.indexOf('},') == oldResultSearcher.indexOf('\},')+1)){
            oldResultSearcher = oldResultSearcher.substring(oldResultSearcher.indexOf('},')+2);
        } else
            break;
        }
        oldResultSearcher = oldResultSearcher.substring(oldResultSearcher.indexOf('},')+2);

        let oldResultSyntax =  oldResult.substring(oldResult.indexOf('"syntax"'), oldResult.indexOf(oldResultSearcher));
        resultContainer.value = oldResult.replace(oldResultSyntax, result);
    }
}