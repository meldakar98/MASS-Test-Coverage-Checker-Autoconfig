import {CoverageMiss} from "./DataStructurs/CoverageMiss.js";
import LineRanges from "./DataStructurs/LineRanges.js";

export default class CheckerCoverageFeedback{
    filename: string = "";
    showFor: CoverageMiss = CoverageMiss.PARTIALLY_MISSED;
    lineRanges: LineRanges | null = null;
    messages: string = "";
    suppresses: string[] = [];

    constructor();

    constructor(filename?:string, showFor?:CoverageMiss, lineRages?:LineRanges|null, messages?:string, suppresses?:string[]){
        this.filename = filename !== undefined ? filename : "";
        this.showFor = showFor !== undefined ? showFor : CoverageMiss.PARTIALLY_MISSED;
        this.lineRanges = lineRages !== undefined ? lineRages : null;
        this.messages = messages !== undefined ? messages : "";
        this.suppresses = suppresses !== undefined ? suppresses : [];
    }

    public buildPartFeedbackBlock() : string{
        //TODO check filename regex : a-z0-9._- (space) > 1 [THROW EXCEPTION AND NOTIFICATION ABOUT MISSING FILE]
        let lineRangeKeyValue = this.lineRanges == null ? '"lineRanges": "",\n' : '"lineRanges": "'+ this.lineRanges.printLineRange() + '",\n';
        let supKeyValue = this.suppresses.length == 0 ? "" : '"suppresses": "'+ this.suppresses.join() +'"\n';
        return '{\n        ' +
                lineRangeKeyValue+
                '"message": "'+ this.messages + '",\n' +
                '"showFor": "' + CoverageMiss[this.showFor] + '",\n' +
                '"fileName": "'+ this.filename +'"\n' +
                supKeyValue +
                '}';
    }

    public buildPartFeedbackBlock_empty() : string{
        return '{\n        ' +
                '"showFor": "'+ CoverageMiss.PARTIALLY_MISSED.toString() +'",\n' +
                '}';
    }
    
}