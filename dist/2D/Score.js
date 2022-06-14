var Score = /** @class */ (function () {
    function Score(score_1, score_2) {
        this.score_1 = Score.MAX_INT;
        this.score_2 = Score.MAX_INT;
        if (typeof score_1 != 'undefined')
            this.score_1 = score_1;
        if (typeof score_2 != 'undefined')
            this.score_2 = score_2;
    }
    /**
     * Lower is better
     */
    Score.prototype.valueOf = function () {
        return (this.score_1 + this.score_2);
    };
    Score.prototype.assign = function (other) {
        this.score_1 = other.score_1;
        this.score_2 = other.score_2;
    };
    Score.prototype.isBlank = function () {
        return this.score_1 === Score.MAX_INT;
    };
    Score.prototype.decreaseBy = function (delta) {
        this.score_1 += delta;
        this.score_2 += delta;
    };
    Score.MAX_INT = Number.MAX_SAFE_INTEGER;
    return Score;
}());
export default Score;
//# sourceMappingURL=Score.js.map