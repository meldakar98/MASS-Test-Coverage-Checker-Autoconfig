import CheckerCoverageFeedback from "../Model/CheckerCoverageFeedback.js";

export default class MASS_CheckerCoverage{
    showTestFailures : boolean = true;
    showFullCoverageReport : boolean = false;
    feedback : CheckerCoverageFeedback[] = [];

    constructor();

    constructor(showTestFailures?:boolean, showFullCoverageReport?:boolean, feedback?:CheckerCoverageFeedback[]){
        this.showTestFailures = showTestFailures !== undefined ? showTestFailures : true;
        this.showFullCoverageReport = showFullCoverageReport !== undefined ? showFullCoverageReport : false;
        this.feedback = feedback !== undefined ? feedback : [];
    }

    public getStringCoverageConfig() : string{
        let sFCR = this.showFullCoverageReport ? "true" : "false";
        let sTF = this.showTestFailures ? "true" : "false";
        let coverageString = '  "coverage": {\n    '+
                            '"feedback": [\n      '+
                            this.getStringFeedbackConfig() +
                            '\n    ],\n    '+
                            '"showFullCoverageReport": '+ sFCR +',\n    '+
                            '"showTestFailures": '+ sTF +'\n  },\n';
        return coverageString;
    }

    public getStringFeedbackConfig() : string {
        var buildedFeedback = this.feedback.length > 0 ? "" : new CheckerCoverageFeedback().buildPartFeedbackBlock_empty();
        for(let i=0; i<this.feedback.length; i++){
            buildedFeedback += this.feedback[i].buildPartFeedbackBlock();
            buildedFeedback += i+1 == this.feedback.length ? "" : ",\n       ";
        }
        return buildedFeedback;
    }
}