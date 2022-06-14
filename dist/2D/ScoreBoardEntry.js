var ScoreBoardEntry = /** @class */ (function () {
    function ScoreBoardEntry(bin, box) {
        this.bin = bin;
        this.box = box;
    }
    ScoreBoardEntry.prototype.calculate = function () {
        this.score = this.bin.scoreFor(this.box);
        return this.score;
    };
    ScoreBoardEntry.prototype.fit = function () {
        return !this.score.isBlank();
    };
    return ScoreBoardEntry;
}());
export default ScoreBoardEntry;
//# sourceMappingURL=ScoreBoardEntry.js.map