import Score from './Score';
import ScoreBoard from './ScoreBoard';
var Packer = /** @class */ (function () {
    function Packer(bins) {
        this.bins = [];
        this.unpackedBoxes = [];
        this.bins = bins;
    }
    Packer.prototype.pack = function (boxes, options) {
        if (options === void 0) { options = {}; }
        var packedBoxes = [];
        var entry;
        boxes = boxes.filter(function (box) { return !box.packed; });
        if (boxes.length === 0)
            return packedBoxes;
        var limit = options.limit || Score.MAX_INT;
        var board = new ScoreBoard(this.bins, boxes);
        while ((entry = board.bestFit())) {
            entry.bin.insert(entry.box);
            board.removeBox(entry.box);
            board.recalculateBin(entry.bin);
            packedBoxes.push({ box: entry.box, score: entry.score });
            if (packedBoxes.length >= limit) {
                break;
            }
        }
        this.unpackedBoxes = boxes.filter(function (box) {
            return !box.packed;
        });
        return packedBoxes;
    };
    return Packer;
}());
export default Packer;
//# sourceMappingURL=Packer.js.map