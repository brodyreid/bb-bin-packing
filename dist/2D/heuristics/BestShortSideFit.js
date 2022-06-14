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
var BestShortSideFit = /** @class */ (function (_super) {
    __extends(BestShortSideFit, _super);
    function BestShortSideFit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BestShortSideFit.prototype.calculateScore = function (freeRect, rectWidth, rectHeight) {
        var leftOverHoriz = Math.abs(freeRect.width - rectWidth);
        var leftOverVert = Math.abs(freeRect.height - rectHeight);
        var args = [leftOverHoriz, leftOverVert].sort(function (a, b) { return a - b; });
        var score = new Score(args[0], args[1]);
        return score;
    };
    return BestShortSideFit;
}(Base));
export default BestShortSideFit;
//# sourceMappingURL=BestShortSideFit.js.map