import CheckerCoverageFeedback from "../Model/CheckerCoverageFeedback.js";

export default class MASS_CheckerCoverage{
    showTestFailures : boolean = true;
    showFullCoverageReport : boolean = false;
    feedback : CheckerCoverageFeedback[] = [];

    constructor();

    constructor(showTestFailures?:boolean, showFullCoverageReport?:boolean, feedback?:CheckerCoverageFeedback[]){
        this.showTestFailures = showTestFailures !== undefined ? showTestFailures : true;
        this.showFullCoverageReport = showTestFailures !== undefined ? showTestFailures : false;
        this.feedback = feedback !== undefined ? feedback : [];
    }

    public getStringCoverageConfig() : string{
        //TODO
        return "";
    }

}