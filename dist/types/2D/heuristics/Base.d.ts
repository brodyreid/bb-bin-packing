import { FreeSpaceBox } from '../Bin';
import Box from '../Box';
import Score from '../Score';
export default class Base {
    findPositionForNewNode(box: Box, freeRects: FreeSpaceBox[]): Score;
    tryPlaceRectIn(freeRect: any, box: Box, rectWidth: any, rectHeight: any, bestScore: any): void;
    calculateScore(_freeRect: any, _rectWidth: any, _rectHeight: any): Score;
}
//# sourceMappingURL=Base.d.ts.map