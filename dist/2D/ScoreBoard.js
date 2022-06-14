var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import ScoreBoardEntry from './ScoreBoardEntry';
var ScoreBoard = /** @class */ (function () {
    function ScoreBoard(bins, boxes) {
        var _this = this;
        this.entries = [];
        bins.forEach(function (bin) {
            _this.addBinEntries(bin, boxes);
        });
    }
    ScoreBoard.prototype.debug = function () {
        require('console.table');
        console.table(this.entries.map(function (entry) { return ({
            bin: entry.bin.label,
            box: entry.box.label,
            score: entry.score,
        }); }));
    };
    ScoreBoard.prototype.addBinEntries = function (bin, boxes) {
        var _this = this;
        boxes.forEach(function (box) {
            var entry = new ScoreBoardEntry(bin, box);
            entry.calculate();
            _this.entries.push(entry);
        });
    };
    ScoreBoard.prototype.largestNotFitingBox = function () {
        var unfit;
        var fittingBoxes = this.entries
            .filter(function (entry) { return entry.fit; })
            .map(function (entry) { return entry.box; });
        this.entries.forEach(function (entry) {
            if (!fittingBoxes.includes(entry.box)) {
                return;
            }
            if (unfit === null || unfit.box.area < entry.box.area) {
                unfit = entry;
            }
        });
        return unfit.box ? unfit : false;
    };
    ScoreBoard.prototype.bestFit = function () {
        var best = null;
        for (var i = 0; i < this.entries.length; i++) {
            var entry = this.entries[i];
            if (!entry.fit()) {
                continue;
            }
            if (best === null || entry.score < best.score) {
                best = entry;
            }
        }
        return best;
    };
    ScoreBoard.prototype.removeBox = function (box) {
        this.entries = this.entries.filter(function (entry) {
            return entry.box !== box;
        });
    };
    ScoreBoard.prototype.addBin = function (bin) {
        this.addBinEntries(bin, this.currentBoxes());
    };
    ScoreBoard.prototype.recalculateBin = function (bin) {
        this.entries
            .filter(function (entry) { return entry.bin === bin; })
            .forEach(function (entry) { return entry.calculate(); });
    };
    ScoreBoard.prototype.currentBoxes = function () {
        return __spreadArray([], __read(new Set(this.entries.map(function (entry) { return entry.box; }))), false);
    };
    return ScoreBoard;
}());
export default ScoreBoard;
//# sourceMappingURL=ScoreBoard.js.map