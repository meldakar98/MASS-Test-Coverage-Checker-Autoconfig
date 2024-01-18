var LineRanges = (function () {
    function LineRanges(start, end) {
        this.end = null;
        this.start = start;
        this.end = end ? (end > start ? end : null) : null;
    }
    LineRanges.prototype.getStart = function () {
        return this.start;
    };
    LineRanges.prototype.getEnd = function () {
        return this.end;
    };
    LineRanges.prototype.setStart = function (start) {
        this.start = start;
    };
    LineRanges.prototype.setEnd = function (end) {
        this.end = end != null ? (end > this.getStart() ? end : null) : null;
    };
    LineRanges.prototype.printLineRange = function () {
        if (this.end == null)
            return this.start.toString();
        return this.start.toString() + "-" + this.end.toString();
    };
    return LineRanges;
}());
export default LineRanges;
