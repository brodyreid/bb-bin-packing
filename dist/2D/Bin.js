var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import BestShortSideFit from './heuristics/BestShortSideFit';
import Box from './Box';
var Bin = /** @class */ (function () {
    function Bin(width, height, heuristic) {
        this.width = 0;
        this.height = 0;
        this.boxes = [];
        this.heuristic = null;
        this.freeRectangles = [];
        this.width = width;
        this.height = height;
        this.freeRectangles = [new FreeSpaceBox(width, height)];
        this.heuristic = heuristic || new BestShortSideFit();
    }
    Object.defineProperty(Bin.prototype, "area", {
        get: function () {
            return this.width * this.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Bin.prototype, "efficiency", {
        get: function () {
            var boxesArea = 0;
            this.boxes.forEach(function (box) {
                boxesArea += box.area;
            });
            return (boxesArea * 100) / this.area;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Bin.prototype, "label", {
        get: function () {
            return "".concat(this.width, "x").concat(this.height, " ").concat(this.efficiency, "%");
        },
        enumerable: false,
        configurable: true
    });
    Bin.prototype.insert = function (box) {
        if (box.packed)
            return false;
        this.heuristic.findPositionForNewNode(box, this.freeRectangles);
        if (!box.packed)
            return false;
        var numRectanglesToProcess = this.freeRectangles.length;
        var i = 0;
        while (i < numRectanglesToProcess) {
            if (this.splitFreeNode(this.freeRectangles[i], box)) {
                this.freeRectangles.splice(i, 1);
                numRectanglesToProcess--;
            }
            else {
                i++;
            }
        }
        this.pruneFreeList();
        this.boxes.push(box);
        return true;
    };
    Bin.prototype.scoreFor = function (box) {
        var copyBox = new Box(box.width, box.height, box.constrainRotation);
        var score = this.heuristic.findPositionForNewNode(copyBox, this.freeRectangles);
        return score;
    };
    Bin.prototype.isLargerThan = function (box) {
        return ((this.width >= box.width && this.height >= box.height) ||
            (this.height >= box.width && this.width >= box.height));
    };
    Bin.prototype.splitFreeNode = function (freeNode, usedNode) {
        // Test with SAT if the rectangles even intersect.
        if (usedNode.x >= freeNode.x + freeNode.width ||
            usedNode.x + usedNode.width <= freeNode.x ||
            usedNode.y >= freeNode.y + freeNode.height ||
            usedNode.y + usedNode.height <= freeNode.y) {
            return false;
        }
        this.trySplitFreeNodeVertically(freeNode, usedNode);
        this.trySplitFreeNodeHorizontally(freeNode, usedNode);
        return true;
    };
    Bin.prototype.trySplitFreeNodeVertically = function (freeNode, usedNode) {
        if (usedNode.x < freeNode.x + freeNode.width &&
            usedNode.x + usedNode.width > freeNode.x) {
            this.tryLeaveFreeSpaceAtTop(freeNode, usedNode);
            this.tryLeaveFreeSpaceAtBottom(freeNode, usedNode);
        }
    };
    Bin.prototype.tryLeaveFreeSpaceAtTop = function (freeNode, usedNode) {
        if (usedNode.y > freeNode.y && usedNode.y < freeNode.y + freeNode.height) {
            var newNode = __assign({}, freeNode);
            newNode.height = usedNode.y - newNode.y;
            this.freeRectangles.push(newNode);
        }
    };
    Bin.prototype.tryLeaveFreeSpaceAtBottom = function (freeNode, usedNode) {
        if (usedNode.y + usedNode.height < freeNode.y + freeNode.height) {
            var newNode = __assign({}, freeNode);
            newNode.y = usedNode.y + usedNode.height;
            newNode.height =
                freeNode.y + freeNode.height - (usedNode.y + usedNode.height);
            this.freeRectangles.push(newNode);
        }
    };
    Bin.prototype.trySplitFreeNodeHorizontally = function (freeNode, usedNode) {
        if (usedNode.y < freeNode.y + freeNode.height &&
            usedNode.y + usedNode.height > freeNode.y) {
            this.tryLeaveFreeSpaceOnLeft(freeNode, usedNode);
            this.tryLeaveFreeSpaceOnRight(freeNode, usedNode);
        }
    };
    Bin.prototype.tryLeaveFreeSpaceOnLeft = function (freeNode, usedNode) {
        if (usedNode.x > freeNode.x && usedNode.x < freeNode.x + freeNode.width) {
            var newNode = __assign({}, freeNode);
            newNode.width = usedNode.x - newNode.x;
            this.freeRectangles.push(newNode);
        }
    };
    Bin.prototype.tryLeaveFreeSpaceOnRight = function (freeNode, usedNode) {
        if (usedNode.x + usedNode.width < freeNode.x + freeNode.width) {
            var newNode = __assign({}, freeNode);
            newNode.x = usedNode.x + usedNode.width;
            newNode.width =
                freeNode.x + freeNode.width - (usedNode.x + usedNode.width);
            this.freeRectangles.push(newNode);
        }
    };
    /**
     * Goes through the free rectangle list and removes any redundant entries.
     */
    Bin.prototype.pruneFreeList = function () {
        var i = 0;
        while (i < this.freeRectangles.length) {
            var j = i + 1;
            if (j === this.freeRectangles.length) {
                break;
            }
            while (j < this.freeRectangles.length) {
                if (this.isContainedIn(this.freeRectangles[i], this.freeRectangles[j])) {
                    this.freeRectangles.splice(i, 1);
                    i--;
                    break;
                }
                if (this.isContainedIn(this.freeRectangles[j], this.freeRectangles[i])) {
                    this.freeRectangles.splice(j, 1);
                }
                else {
                    j++;
                }
                i++;
            }
        }
    };
    Bin.prototype.isContainedIn = function (rectA, rectB) {
        return (rectA &&
            rectB &&
            rectA.x >= rectB.x &&
            rectA.y >= rectB.y &&
            rectA.x + rectA.width <= rectB.x + rectB.width &&
            rectA.y + rectA.height <= rectB.y + rectB.height);
    };
    return Bin;
}());
export default Bin;
var FreeSpaceBox = /** @class */ (function () {
    function FreeSpaceBox(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = null;
        this.height = null;
        this.width = width;
        this.height = height;
    }
    return FreeSpaceBox;
}());
export { FreeSpaceBox };
//# sourceMappingURL=Bin.js.map