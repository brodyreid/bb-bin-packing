import { FreeSpaceBox } from '../Bin';
import Box from '../Box';
import Score from '../Score';
export default class Base {
    findPositionForNewNode(box: Box, freeRects: FreeSpaceBox[]): Score;
    tryPlaceRectIn(freeRect: any, box: any, rectWidth: any, rectHeight: any, bestScore: any): void;
    calculateScore(): void;
}
//# sourceMappingURL=Base.d.ts.map