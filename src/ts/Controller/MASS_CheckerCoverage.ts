import {CoverageMiss} from "../Model/DataStructurs/CoverageMiss.js";
import CheckerCoverageFeedback from "../Model/CheckerCoverageFeedback.js";
import LineRanges from "../Model/DataStructurs/LineRanges.js";
import { readFile } from "./Helper.js";

interface AssociativeArrayFeedbacks {
  [key: string]: CheckerCoverageFeedback
}

export default class MASS_CheckerCoverage{
    showTestFailures : boolean = true;
    showFullCoverageReport : boolean = false;
    feedback : AssociativeArrayFeedbacks[] = [];

    constructor(showTestFailures?:boolean, showFullCoverageReport?:boolean, feedback?:AssociativeArrayFeedbacks[]){
        this.showTestFailures = showTestFailures !== undefined ? showTestFailures : true;
        this.showFullCoverageReport = showFullCoverageReport !== undefined ? showFullCoverageReport : false;
        this.feedback = feedback !== undefined ? feedback : [];
    }

    public getStringCoverageConfig() : string{
        let sFCR = this.showFullCoverageReport ? "true" : "false";
        let sTF = this.showTestFailures ? "true" : "false";
        let coverageString = '\n  "coverage": {\n    '+
                            '"feedback": [\n      '+
                            this.getStringFeedbackConfig() +
                            '\n    ],\n    '+
                            '"showFullCoverageReport": '+ sFCR +',\n    '+
                            '"showTestFailures": '+ sTF +'\n  },';
          return coverageString;
    }

    public getStringFeedbackConfig() : string {
        let fbKeys = Object.keys(this.feedback);
        var buildedFeedback = fbKeys.length > 0 ? "" : new CheckerCoverageFeedback().buildPartFeedbackBlock_empty();
        for(let fbKey in this.feedback){
            buildedFeedback += this.feedback[fbKey as string].buildPartFeedbackBlock();
            buildedFeedback += fbKey == fbKeys[fbKeys.length-1] ? "" : ",\n    ";
        }
        return buildedFeedback;
    }

  //1- Build array of syntactic errors & build array of feedback block
  //2- Parse coverage value of config and replace completely with new results
  public buildConfigFromJavaFile(files, isReplacingOld:boolean){
    const keyWordStartCov: string = '@mass_cvStart(';
    const keyWordEndCov: string = '@mass_cvEnd(';
    try {
      // Iterate through each file
      for (const file of files) {
        if (file.type == "text/x-java-source" || file.name.endsWith(".java")) {
            readFile(file)
              .then((fileContent)=> {
                // Split the file content into lines
                const lines = fileContent.split('\n');
                // Iterate through each line
                for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {   
                  const line = lines[lineNumber];
                  // Check if the line is a comment ALSO handle comment at the end of the line
                  if (line.includes('//')) {
                    // Check if the line contains the search strings
                    if (line.includes(keyWordStartCov) || line.includes(keyWordEndCov)) {
                      // Add the found strings to the array
                      if (line.includes(keyWordStartCov)) {
                        let feedbackPart: any[] = this.extractFeedbackPart(lines, line, "//", lineNumber, lineNumber);
                        // build object for config (check strings formats)
                        this.feedback[feedbackPart[0] as string] = new CheckerCoverageFeedback(
                            feedbackPart[0],
                            file.name,
                            feedbackPart[2],
                            new LineRanges(feedbackPart[4]),
                            feedbackPart[1],
                            feedbackPart[3]
                        );
                      }
                      if (line.includes(keyWordEndCov)) {
                        //fetch id
                        let startParams = line.substring(line.indexOf(keyWordEndCov));
                        startParams = startParams.substring(startParams.indexOf('"')+1);
                        let msgId = startParams.substring(0, startParams.lastIndexOf(')')-1);
                        while(msgId.lastIndexOf(')') >= 0){
                          if(msgId.lastIndexOf(')') != msgId.lastIndexOf('\)')+1){
                            msgId = msgId.substring(0, msgId.lastIndexOf(')')-1);
                            msgId = msgId.substring(0, msgId.lastIndexOf('"')-1);
                          } else
                            break;
                        }
                        // Find the previous non-empty Java instruction line
                        let previousInstructionLine = line.trim().startsWith('//') ? lineNumber : lineNumber+1;
                        while(previousInstructionLine!=lineNumber && previousInstructionLine > 0){
                          if(lines[previousInstructionLine].trim() != '')
                            break;
                            previousInstructionLine--;
                        }
                        //update CheckerCoverageFeedbacks[msgId]
                        if(this.feedback.hasOwnProperty(msgId)){
                          this.feedback[msgId].lineRanges.setEnd(previousInstructionLine);
                        }
                      }
                    }
                  } else if (line.includes('/*')) {
                    //TODO handle muti-lines
                    //find start and end of comment
                    let endCommentLineNumber:number = lineNumber;
                    let comment: string = "";
                    for(let lookingLineNber = lineNumber; lines.length; lookingLineNber++){
                      comment += lines[lookingLineNber];
                      if(lines[lookingLineNber].includes('*/')){
                        endCommentLineNumber = lookingLineNber;
                        break;
                      }
                    }
                    comment = comment.substring(comment.indexOf('/*'), comment.lastIndexOf('*/')+2);
                    // Check if the line contains the search strings
                    if (comment.includes(keyWordStartCov) || comment.includes(keyWordEndCov)) {
                       // Add the found strings to the array
                       if (comment.includes(keyWordStartCov)) {
                        let feedbackPart: any[] = this.extractFeedbackPart(lines, comment, "/*", lineNumber, endCommentLineNumber);
                        // build object for config (check strings formats)
                        this.feedback[feedbackPart[0] as string] = new CheckerCoverageFeedback(
                            feedbackPart[0],
                            file.name,
                            feedbackPart[2],
                            new LineRanges(feedbackPart[4]),
                            feedbackPart[1],
                            feedbackPart[3]
                        );
                      }
                    }
                    if (comment.includes(keyWordEndCov)) {
                      //fetch id
                      let startParams = comment.substring(comment.indexOf(keyWordEndCov));
                      startParams = startParams.substring(startParams.indexOf('"')+1);
                      let msgId = startParams.substring(0, startParams.lastIndexOf(')')-1);
                      while(msgId.lastIndexOf(')') >= 0){
                        if(msgId.lastIndexOf(')') != msgId.lastIndexOf('\)')+1){
                          msgId = msgId.substring(0, msgId.lastIndexOf(')')-1);
                          msgId = msgId.substring(0, msgId.lastIndexOf('"')-1);
                        } else
                          break;
                      }
                      // Find the previous non-empty Java instruction line
                      let previousInstructionLine = line.trim().startsWith('/*') ? lineNumber : lineNumber+1;
                      while(previousInstructionLine!=lineNumber && previousInstructionLine > 0){
                        if(lines[previousInstructionLine].trim() != '')
                          break;
                          previousInstructionLine--;
                      }
                      //update CheckerCoverageFeedbacks[msgId]
                      if(this.feedback.hasOwnProperty(msgId)){
                        this.feedback[msgId].lineRanges.setEnd(previousInstructionLine);
                      }
                    }

                  }
                }
                this.updateResult(isReplacingOld);
              }); 
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  public updateResult_testFailures(showTestFailures: boolean){
    let result: string = '"showTestFailures": '+ showTestFailures.toString();
    let resultContainer = document.querySelector(".overview_result textarea.boxContainer") as HTMLTextAreaElement;
    let oldResult = resultContainer.value;
    let oldResultTestFailures = oldResult.substring(oldResult.indexOf('"showTestFailures"'));
    oldResultTestFailures = oldResultTestFailures.substring(0, oldResultTestFailures.indexOf('}'));
    if(oldResultTestFailures.indexOf(',')>=0){
      oldResultTestFailures = oldResultTestFailures.substring(0, oldResultTestFailures.indexOf(','));
    }else{
      if(oldResultTestFailures.indexOf('true')>=0){
        oldResultTestFailures = oldResultTestFailures.substring(0, oldResultTestFailures.indexOf('true')+4);
      } else {
        oldResultTestFailures = oldResultTestFailures.substring(0, oldResultTestFailures.indexOf('false')+5);
      }
    }
    resultContainer.value = oldResult.replace(oldResultTestFailures, result);
  }


  public updateResult_testFullReport(showFullCoverageReport: boolean){
    let result: string = '"showFullCoverageReport": '+ showFullCoverageReport.toString();
    let resultContainer = document.querySelector(".overview_result textarea.boxContainer") as HTMLTextAreaElement;
    let oldResult = resultContainer.value;
    let oldResultTestFullReport = oldResult.substring(oldResult.indexOf('"showFullCoverageReport"'));
    oldResultTestFullReport = oldResultTestFullReport.substring(0, oldResultTestFullReport.indexOf('}'));
    if(oldResultTestFullReport.indexOf(',')>=0){
      oldResultTestFullReport = oldResultTestFullReport.substring(0, oldResultTestFullReport.indexOf(','));
    }else{
      if(oldResultTestFullReport.indexOf('true')>=0){
        oldResultTestFullReport = oldResultTestFullReport.substring(0, oldResultTestFullReport.indexOf('true')+4);
      } else {
        oldResultTestFullReport = oldResultTestFullReport.substring(0, oldResultTestFullReport.indexOf('false')+5);
      }
    }
    resultContainer.value = oldResult.replace(oldResultTestFullReport, result);
  }


  public updateResult(isReplacingOld:boolean){
    this.showTestFailures = (document.getElementById("test_failures") as HTMLInputElement).checked;
    this.showFullCoverageReport = (document.getElementById("test_full_report")  as HTMLInputElement).checked;
    let resultContainer = document.querySelector(".overview_result textarea.boxContainer") as HTMLTextAreaElement;
    let oldResult = resultContainer.value;

    let oldResultCoverage = oldResult.substring(oldResult.indexOf('"semantic"')+10);
    oldResultCoverage = oldResultCoverage.substring(oldResultCoverage.indexOf(':')+1);
    oldResultCoverage = oldResultCoverage.substring(oldResultCoverage.indexOf('{')+1);
    while(oldResultCoverage.indexOf('}') >= 0){
      if((oldResultCoverage.indexOf('\}')!=-1) && (oldResultCoverage.indexOf('}') == oldResultCoverage.indexOf('\}')+1)){
        oldResultCoverage = oldResultCoverage.substring(oldResultCoverage.indexOf('}')+1);
      } else
        break;
    }
    oldResultCoverage = oldResultCoverage.substring(oldResultCoverage.indexOf('}')+1);
    oldResultCoverage = oldResultCoverage.substring(oldResultCoverage.indexOf(',')+1);
    oldResultCoverage = oldResultCoverage.substring(0, oldResultCoverage.indexOf('"classes"'));

    if(isReplacingOld){
      // fetch complet result and replace coverage result
      //find the first "coverage" betwween "semantic": {}, and "classes": {},
      resultContainer.value = oldResult.substring(0, oldResult.indexOf(oldResultCoverage)) + this.getStringCoverageConfig() + "\n  "+ oldResult.substring(oldResult.indexOf(oldResultCoverage)+ oldResultCoverage.length);
    }else{
      // fetch complet result and append coverage result at the end of current coverage
      oldResultCoverage = oldResultCoverage.substring(0, oldResultCoverage.lastIndexOf('"}"'));
      resultContainer.value = oldResult.substring(0, oldResult.indexOf(oldResultCoverage)) + ",\n    " + this.getStringFeedbackConfig() + oldResult.substring(oldResult.indexOf(oldResultCoverage)+ oldResultCoverage.length);
    }
  }


  private extractFeedbackPart(lines, line, commentStartString, kwFirstCharLineNumber, kwLastCharLineNumber): any[]{
    const keyWordStartCov: string = '@mass_cvStart(';
    //fetch parameters
    let startParams = line.substring(line.indexOf(keyWordStartCov));
    startParams = startParams.substring(startParams.indexOf('"')+1);
    let params = startParams.substring(0, startParams.lastIndexOf('"'));
    let paramsConcat = params;
    let currPartConcatParam = "";
    let arrayParams = [];
    while(paramsConcat.indexOf('",') >= 0){
      currPartConcatParam += paramsConcat.substring(0, paramsConcat.indexOf('",'));
      if((paramsConcat.indexOf('\",')!=-1 && (paramsConcat.indexOf('",') == paramsConcat.indexOf('\",')+1)) || (paramsConcat.indexOf('\\",')!=-1 && (paramsConcat.indexOf('",') == paramsConcat.indexOf('\\",')+2))){
        paramsConcat = paramsConcat.substring(paramsConcat.indexOf('",')+2);
      } else {
        arrayParams.push(currPartConcatParam);
        paramsConcat = paramsConcat.substring(paramsConcat.indexOf('",')+2);
        paramsConcat = paramsConcat.substring(paramsConcat.indexOf('"')+1);
        currPartConcatParam = "";
      }
    }
    arrayParams.push(paramsConcat);
    //TODO if array bigger than 4 elements, save errors. else
    //id : arrayParams[0]
    arrayParams[0] = arrayParams[0].replaceAll(/\s/g,'');
    //message : arrayParams[1];
    //coverageMiss : arrayParams[2] 
    arrayParams[2] = arrayParams[2].replaceAll(/\s/g,'') == CoverageMiss.FULLY_MISSED.toString() ? CoverageMiss.FULLY_MISSED : CoverageMiss.PARTIALLY_MISSED;
    //supMessages : arrayParams[3]
    arrayParams[3]= arrayParams[3].replaceAll(/\s/g,'').split(','); 
    // Find the next non-empty Java instruction line
    let nextInstructionLine : number = line.trim().startsWith(commentStartString) ? kwLastCharLineNumber+2 : kwLastCharLineNumber+1;
    while(nextInstructionLine!=kwLastCharLineNumber && nextInstructionLine < lines.length){
        if(lines[nextInstructionLine].trim() != '')
          break;
        nextInstructionLine++;
    }
    arrayParams.push(nextInstructionLine);
    return arrayParams;
  }

}