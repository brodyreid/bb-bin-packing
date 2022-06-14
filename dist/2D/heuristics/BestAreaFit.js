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
var BestAreaFit = /** @class */ (function (_super) {
    __extends(BestAreaFit, _super);
    function BestAreaFit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BestAreaFit.prototype.calculateScore = function (freeRect, rectWidth, rectHeight) {
        var areaFit = freeRect.width * freeRect.height - rectWidth * rectHeight;
        var leftOverHoriz = Math.abs(freeRect.width - rectWidth);
        var leftOverVert = Math.abs(freeRect.height - rectHeight);
        var shortSideFit = Math.min(leftOverHoriz, leftOverVert);
        return new Score(areaFit, shortSideFit);
    };
    return BestAreaFit;
}(Base));
export default BestAreaFit;
//# sourceMappingURL=BestAreaFit.js.map