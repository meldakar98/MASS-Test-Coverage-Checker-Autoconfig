import { CoverageMiss } from "./DataStructurs/CoverageMiss.js";
var CheckerCoverageFeedback = (function () {
    function CheckerCoverageFeedback(ID, filename, showFor, lineRages, messages, suppresses) {
        this.ID = "";
        this.filename = "";
        this.showFor = CoverageMiss.PARTIALLY_MISSED;
        this.lineRanges = null;
        this.messages = "";
        this.suppresses = [];
        this.ID = ID !== undefined ? ID : "";
        this.filename = filename !== undefined ? filename : "";
        this.showFor = showFor !== undefined ? showFor : CoverageMiss.PARTIALLY_MISSED;
        this.lineRanges = lineRages !== undefined ? lineRages : null;
        this.messages = messages !== undefined ? messages : "";
        this.suppresses = suppresses !== undefined ? suppresses : [];
    }
    CheckerCoverageFeedback.prototype.buildPartFeedbackBlock = function () {
        var lineRangeValue = '';
        for (var i = 0; i < this.lineRanges.length; i++) {
            lineRangeValue += this.lineRanges[i].printLineRange();
            lineRangeValue += i + 1 < this.lineRanges.length ? ',' : '';
        }
        var lineRangeKeyValue = this.lineRanges == null ? '"lineRanges": "",\n        ' : '"lineRanges": "' + lineRangeValue + '",\n        ';
        var supKeyValue = this.suppresses.length == 0 ? "" : '"suppresses": "' + this.suppresses.join() + '"\n      ';
        var fName = this.suppresses.length == 0 ? '"fileName": "' + this.filename + '"\n      ' : '"fileName": "' + this.filename + '",\n        ';
        return '{\n        ' +
            '"ID": "' + this.ID + '",\n        ' +
            lineRangeKeyValue +
            '"message": "' + this.messages + '",\n        ' +
            '"showFor": "' + CoverageMiss[this.showFor] + '",\n        ' +
            fName +
            supKeyValue +
            '}';
    };
    CheckerCoverageFeedback.prototype.buildPartFeedbackBlock_empty = function () {
        return '{}';
    };
    return CheckerCoverageFeedback;
}());
export default CheckerCoverageFeedback;
