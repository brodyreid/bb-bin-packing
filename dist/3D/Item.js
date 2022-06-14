var _a;
import { factoredInteger } from './util';
export var RotationType_WHD = 0;
export var RotationType_HWD = 1;
export var RotationType_HDW = 2;
export var RotationType_DHW = 3;
export var RotationType_DWH = 4;
export var RotationType_WDH = 5;
export var WidthAxis = 0;
export var HeightAxis = 1;
export var DepthAxis = 2;
export var StartPosition = [0, 0, 0];
export var RotationTypeStrings = (_a = {},
    _a[RotationType_WHD] = 'RotationType_WHD (w,h,d)',
    _a[RotationType_HWD] = 'RotationType_HWD (h,w,d)',
    _a[RotationType_HDW] = 'RotationType_HDW (h,d,w)',
    _a[RotationType_DHW] = 'RotationType_DHW (d,h,w)',
    _a[RotationType_DWH] = 'RotationType_DWH (d,w,h)',
    _a[RotationType_WDH] = 'RotationType_WDH (w,d,h)',
    _a);
var Item = /** @class */ (function () {
    function Item(name, w, h, d, wg, allowedRotation) {
        this.name = '';
        this.width = 0;
        this.height = 0;
        this.depth = 0;
        this.weight = 0;
        this.allowedRotation = [0, 1, 2, 3, 4, 5];
        this.rotationType = RotationType_WHD;
        this.position = []; // x, y, z
        this.name = name;
        this.width = factoredInteger(w);
        this.height = factoredInteger(h);
        this.depth = factoredInteger(d);
        this.weight = factoredInteger(wg);
        this.allowedRotation = allowedRotation ? allowedRotation : this.allowedRotation;
    }
    Item.prototype.getWidth = function () {
        return this.width;
    };
    Item.prototype.getHeight = function () {
        return this.height;
    };
    Item.prototype.getDepth = function () {
        return this.depth;
    };
    Item.prototype.getWeight = function () {
        return this.weight;
    };
    Item.prototype.getRotationType = function () {
        return this.rotationType;
    };
    Item.prototype.getAllowedRotation = function () {
        return this.allowedRotation;
    };
    Item.prototype.getRotationTypeString = function () {
        return RotationTypeStrings[this.getRotationType()];
    };
    Item.prototype.getDimension = function () {
        var d;
        switch (this.rotationType) {
            case RotationType_WHD:
                d = [this.getWidth(), this.getHeight(), this.getDepth()];
                break;
            case RotationType_HWD:
                d = [this.getHeight(), this.getWidth(), this.getDepth()];
                break;
            case RotationType_HDW:
                d = [this.getHeight(), this.getDepth(), this.getWidth()];
                break;
            case RotationType_DHW:
                d = [this.getDepth(), this.getHeight(), this.getWidth()];
                break;
            case RotationType_DWH:
                d = [this.getDepth(), this.getWidth(), this.getHeight()];
                break;
            case RotationType_WDH:
                d = [this.getWidth(), this.getDepth(), this.getHeight()];
                break;
        }
        return d;
    };
    Item.prototype.intersect = function (i2) {
        return rectIntersect(this, i2, WidthAxis, HeightAxis) &&
            rectIntersect(this, i2, HeightAxis, DepthAxis) &&
            rectIntersect(this, i2, WidthAxis, DepthAxis);
    };
    Item.prototype.getVolume = function () {
        return this.getWidth() * this.getHeight() * this.getDepth();
    };
    Item.prototype.toString = function () {
        return "Item:".concat(this.name, " (").concat(this.getRotationTypeString(), " = ").concat(this.getDimension().join('x'), ", Wg. = ").concat(this.weight, ")");
    };
    return Item;
}());
export default Item;
export var rectIntersect = function (i1, i2, x, y) {
    var d1, d2, cx1, cy1, cx2, cy2, ix, iy;
    d1 = i1.getDimension();
    d2 = i2.getDimension();
    cx1 = i1.position[x] + d1[x] / 2;
    cy1 = i1.position[y] + d1[y] / 2;
    cx2 = i2.position[x] + d2[x] / 2;
    cy2 = i2.position[y] + d2[y] / 2;
    ix = Math.max(cx1, cx2) - Math.min(cx1, cx2);
    iy = Math.max(cy1, cy2) - Math.min(cy1, cy2);
    return ix < (d1[x] + d2[x]) / 2 && iy < (d1[y] + d2[y]) / 2;
};
//# sourceMappingURL=Item.js.map