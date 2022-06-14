var Box = /** @class */ (function () {
    function Box(width, height, constrainRotation) {
        if (constrainRotation === void 0) { constrainRotation = false; }
        this.width = 0;
        this.height = 0;
        this.constrainRotation = false;
        this.x = 0;
        this.y = 0;
        this.packed = false;
        this.width = width;
        this.height = height;
        // Avoid the packer to try the rotated dimensions
        this.constrainRotation = constrainRotation;
    }
    Box.prototype.rotate = function () {
        var _a = this, width = _a.width, height = _a.height;
        this.width = height;
        this.height = width;
    };
    Object.defineProperty(Box.prototype, "label", {
        get: function () {
            return "".concat(this.width, "x").concat(this.height, " at [").concat(this.x, ",").concat(this.y, "]");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "area", {
        get: function () {
            return this.width * this.height;
        },
        enumerable: false,
        configurable: true
    });
    return Box;
}());
export default Box;
//# sourceMappingURL=Box.js.map