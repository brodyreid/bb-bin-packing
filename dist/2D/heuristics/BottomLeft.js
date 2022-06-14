var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Base from './Base';
import Score from '../Score';
var BottomLeft = /** @class */ (function (_super) {
    __extends(BottomLeft, _super);
    function BottomLeft() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BottomLeft.prototype.calculateScore = function (freeRect, rectWidth, rectHeight) {
        var topSideY = freeRect.y + rectHeight;
        return new Score(topSideY, freeRect.x);
    };
    return BottomLeft;
}(Base));
export default BottomLeft;
//# sourceMappingURL=BottomLeft.js.map