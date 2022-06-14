import { factoredInteger } from './util';
import { createLogger } from "../lib/log";
var log = createLogger('3D:');
var Bin = /** @class */ (function () {
    function Bin(name, w, h, d, mw) {
        this.name = '';
        this.width = 0;
        this.height = 0;
        this.depth = 0;
        this.maxWeight = 0;
        this.items = [];
        this.name = name;
        this.width = factoredInteger(w);
        this.height = factoredInteger(h);
        this.depth = factoredInteger(d);
        this.maxWeight = factoredInteger(mw);
    }
    Bin.prototype.getName = function () {
        return this.name;
    };
    Bin.prototype.getWidth = function () {
        return this.width;
    };
    Bin.prototype.getHeight = function () {
        return this.height;
    };
    Bin.prototype.getDepth = function () {
        return this.depth;
    };
    Bin.prototype.getMaxWeight = function () {
        return this.maxWeight;
    };
    Bin.prototype.getItems = function () {
        return this.items;
    };
    Bin.prototype.getVolume = function () {
        return this.getWidth() * this.getHeight() * this.getDepth();
    };
    Bin.prototype.getPackedWeight = function () {
        return this.items.reduce(function (weight, item) { return weight + item.getWeight(); }, 0);
    };
    Bin.prototype.weighItem = function (item) {
        var maxWeight = this.getMaxWeight();
        return !maxWeight || item.getWeight() + this.getPackedWeight() <= maxWeight;
    };
    /**
     * Calculate a score for a given item and rotation type.
     *
     * Scores are higher for rotations that closest match item dimensions to Bin dimensions.
     * For example, rotating the item so the longest side is aligned with the longest Bin side.
     *
     * Example (Bin is 11 x 8.5 x 5.5, Item is 8.1 x 5.2 x 5.2):
     *  Rotation 0:
     *    8.1 / 11  = 0.736
     *    5.2 / 8.5 = 0.612
     *    5.2 / 5.5 = 0.945
     *    -----------------
     *    0.736 ** 2 + 0.612 ** 2 + 0.945 ** 2 = 1.809
     *
     *  Rotation 1:
     *    8.1 / 8.5 = 0.953
     *    5.2 / 11 = 0.473
     *    5.2 / 5.5 = 0.945
     *    -----------------
     *    0.953 ** 2 + 0.473 ** 2 + 0.945 ** 2 = 2.025
     *
     * @param {Item} item
     * @param {int} rotationType
     * @return {float} score
     */
    Bin.prototype.scoreRotation = function (item, rotationType) {
        item.rotationType = rotationType;
        var d = item.getDimension();
        // If the item doesn't fit in the Bin
        if (this.getWidth() < d[0] || this.getHeight() < d[1] || this.getDepth() < d[2]) {
            return 0;
        }
        // Square the results to increase the impact of high values (e.g. > 0.8)
        var widthScore = Math.pow(d[0] / this.getWidth(), 2);
        var heightScore = Math.pow(d[1] / this.getHeight(), 2);
        var depthScore = Math.pow(d[2] / this.getDepth(), 2);
        return widthScore + heightScore + depthScore;
    };
    /**
     * Calculate the best rotation order for a given Item based on scoreRotation().
     *
     * @param {Item} item
     * @return {Array} Rotation types sorted by their score, DESC
     */
    Bin.prototype.getBestRotationOrder = function (item) {
        var rotationScores = {};
        // Score all rotation types
        for (var i = 0; i < item.allowedRotation.length; i++) {
            var r = item.allowedRotation[i];
            rotationScores[r] = this.scoreRotation(item, r);
        }
        // Sort the rotation types (index of scores object) DESC
        // and ensure Int values (Object.keys returns strings)
        var sortedRotations = Object.keys(rotationScores).sort(function (a, b) {
            return rotationScores[b] - rotationScores[a];
        }).map(Number);
        return sortedRotations;
    };
    Bin.prototype.putItem = function (item, p) {
        var box = this;
        var fit = false;
        var rotations = this.getBestRotationOrder(item);
        item.position = p;
        for (var i = 0; i < rotations.length; i++) {
            item.rotationType = rotations[i];
            var d = item.getDimension();
            if (box.getWidth() < p[0] + d[0] || box.getHeight() < p[1] + d[1] || box.getDepth() < p[2] + d[2]) {
                fit = false;
            }
            else {
                fit = true;
                for (var j = 0; j < box.items.length; j++) {
                    var _j = box.items[j];
                    if (_j.intersect(item)) {
                        fit = false;
                        break;
                    }
                }
                if (fit) {
                    box.items.push(item);
                }
            }
            log('try to putItem', fit, 'item', item.toString(), 'box', box.toString());
            if (fit) {
                break;
            }
        }
        return fit;
    };
    Bin.prototype.toString = function () {
        return "Bin:".concat(this.name, " (WxHxD = ").concat(this.getWidth(), "x").concat(this.getHeight(), "x").concat(this.getDepth(), ", MaxWg. = ").concat(this.getMaxWeight(), ")");
    };
    return Bin;
}());
export default Bin;
//# sourceMappingURL=Bin.js.map