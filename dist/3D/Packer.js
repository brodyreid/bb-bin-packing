import { StartPosition, WidthAxis, HeightAxis, DepthAxis } from './Item';
var Packer = /** @class */ (function () {
    function Packer() {
        this.bins = [];
        this.items = [];
        this.unfitItems = [];
    }
    Packer.prototype.addBin = function (bin) {
        this.bins.push(bin);
    };
    Packer.prototype.addItem = function (item) {
        this.items.push(item);
    };
    Packer.prototype.findFittedBin = function (i) {
        for (var _i = 0; _i < this.bins.length; _i++) {
            var b = this.bins[_i];
            if (!b.weighItem(i) || !b.putItem(i, StartPosition)) {
                continue;
            }
            if (b.items.length === 1 && b.items[0] === i) {
                b.items = [];
            }
            return b;
        }
        return null;
    };
    Packer.prototype.getBiggerBinThan = function (b) {
        var v = b.getVolume();
        for (var _i = 0; _i < this.bins; _i++) {
            var b2 = this.bins[_i];
            if (b2.getVolume() > v) {
                return b2;
            }
        }
        return null;
    };
    Packer.prototype.unfitItem = function () {
        if (this.items.length === 0) {
            return;
        }
        this.unfitItems.push(this.items[0]);
        this.items.splice(0, 1);
    };
    Packer.prototype.packToBin = function (b, items) {
        var b2 = null;
        var unpacked = [];
        var fit = b.weighItem(items[0]) && b.putItem(items[0], StartPosition);
        if (!fit) {
            var b2_1 = this.getBiggerBinThan(b);
            if (b2_1) {
                return this.packToBin(b2_1, items);
            }
            return this.items;
        }
        // Pack unpacked items.
        for (var _i = 1; _i < this.items.length; _i++) {
            var fitted = false;
            var item = this.items[_i];
            if (b.weighItem(item)) {
                // Try available pivots in current bin that are not intersect with
                // existing items in current bin.
                lookup: for (var _pt = 0; _pt < 3; _pt++) {
                    for (var _j = 0; _j < b.items.length; _j++) {
                        var pv = void 0;
                        var ib = b.items[_j];
                        var d = ib.getDimension();
                        switch (_pt) {
                            case WidthAxis:
                                pv = [ib.position[0] + d[0], ib.position[1], ib.position[2]];
                                break;
                            case HeightAxis:
                                pv = [ib.position[0], ib.position[1] + d[1], ib.position[2]];
                                break;
                            case DepthAxis:
                                pv = [ib.position[0], ib.position[1], ib.position[2] + d[2]];
                                break;
                        }
                        if (b.putItem(item, pv)) {
                            fitted = true;
                            break lookup;
                        }
                    }
                }
            }
            if (!fitted) {
                while (b2 !== null) {
                    b2 = this.getBiggerBinThan(b);
                    if (b2) {
                        b2.items.push(item);
                        var left = this.packToBin(b2, b2.items);
                        if (left.length === 0) {
                            b = b2;
                            fitted = true;
                            break;
                        }
                    }
                }
                if (!fitted) {
                    unpacked.push(item);
                }
            }
        }
        return unpacked;
    };
    Packer.prototype.pack = function () {
        // Sort bins smallest to largest.
        this.bins.sort(function (a, b) {
            return a.getVolume() - b.getVolume();
        });
        // Sort items largest to smallest.
        this.items.sort(function (a, b) {
            return b.getVolume() - a.getVolume();
        });
        while (this.items.length > 0) {
            var bin = this.findFittedBin(this.items[0]);
            if (bin === null) {
                this.unfitItem();
                continue;
            }
            this.items = this.packToBin(bin, this.items);
        }
        return null;
    };
    return Packer;
}());
export default Packer;
//# sourceMappingURL=Packer.js.map