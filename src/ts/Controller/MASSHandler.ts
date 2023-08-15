import MASS_Syntax from "../Model/MASS_Syntax.js";
import MASS_CheckerStyle from "../Model/MASS_CheckerStyle.js";
import MASS_CheckerSemantic from "../Model/MASS_CheckerSemantic.js";
import MASS_CheckerCoverage from "./MASS_CheckerCoverage.js";
import MASS_CheckerClass from "../Model/MASS_CheckerClass.js";
import MASS_CheckerMetric from "../Model/MASS_CheckerMetric.js";

export default class MASSHandler{

    styleSelected: boolean = false;
    semanticSelected: boolean = false;
    coverageSelected: boolean = true;
    classSelected: boolean = false;
    metricsSelected: boolean = false;

    constructor(styleSelected?: boolean, semanticSelected?: boolean, coverageSelected?: boolean, classSelected?: boolean, metricsSelected?: boolean){
        this.styleSelected = styleSelected !== undefined ? styleSelected : false;
        this.semanticSelected = semanticSelected !== undefined ? semanticSelected : false;
        this.coverageSelected = coverageSelected !== undefined ? coverageSelected : true;
        this.classSelected = classSelected !== undefined ? classSelected : false;
        this.metricsSelected = metricsSelected !== undefined ? metricsSelected : false;
    }

    public getDefault_massFullConfig(): string{
        let syntax : MASS_Syntax = new MASS_Syntax(); 
        let style : MASS_CheckerStyle = new MASS_CheckerStyle(); 
        let semantic : MASS_CheckerSemantic = new MASS_CheckerSemantic(); 
        let coverage : MASS_CheckerCoverage = new MASS_CheckerCoverage(); 
        let checkerclass : MASS_CheckerClass = new MASS_CheckerClass(); 
        let metric : MASS_CheckerMetric = new MASS_CheckerMetric(); 
        
        return '{'+
                syntax.getDefault_massSyntax() + 
                this.getDefault_massSelected() + 
                style.getDefault_massStyle() + 
                semantic.getDefault_massSemantic() + 
                coverage.getStringCoverageConfig() + 
                checkerclass.getDefault_massClass() + 
                metric.getDefault_massMetric() +
            '}';
    }

    public getDefault_massSelected(): string{
        return '\n  "styleSelected": '+this.styleSelected.toString()+',\n  "semanticSelected": '+this.semanticSelected.toString()+',\n  "coverageSelected": '+this.coverageSelected.toString()+',\n  "classSelected": '+this.classSelected.toString()+',\n  "metricsSelected": '+this.metricsSelected.toString()+',';
    }

} 