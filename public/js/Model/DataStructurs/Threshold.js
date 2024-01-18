var Threshold = (function () {
    function Threshold(min, max, noMax, suggestionMin, suggestionMax) {
        this.min = min;
        this.max = max;
        this.noMax = noMax;
        this.suggestionMin = suggestionMin;
        this.suggestionMax = suggestionMax;
    }
    Threshold.prototype.getMin = function () {
        return this.min;
    };
    Threshold.prototype.getMax = function () {
        return this.max;
    };
    Threshold.prototype.getNoMax = function () {
        return this.noMax;
    };
    Threshold.prototype.getSuggestionMin = function () {
        return this.suggestionMin;
    };
    Threshold.prototype.getSuggestionMax = function () {
        return this.suggestionMax;
    };
    Threshold.prototype.setMin = function (min) {
        this.min;
    };
    Threshold.prototype.setMax = function (max) {
        this.max = max;
    };
    Threshold.prototype.setNoMax = function (noMax) {
        this.noMax = noMax;
    };
    Threshold.prototype.setSuggestionMin = function (suggestionMin) {
        this.suggestionMin = suggestionMin;
    };
    Threshold.prototype.setSuggestionMax = function (suggestionMax) {
        this.suggestionMax = suggestionMax;
    };
    return Threshold;
}());
export default Threshold;
