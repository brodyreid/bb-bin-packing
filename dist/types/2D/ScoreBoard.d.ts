import Bin from './Bin';
import Box from './Box';
import ScoreBoardEntry from './ScoreBoardEntry';
export default class ScoreBoard {
    entries: ScoreBoardEntry[];
    constructor(bins: Bin[], boxes: Box[]);
    debug(): void;
    addBinEntries(bin: any, boxes: any): void;
    largestNotFitingBox(): any;
    bestFit(): ScoreBoardEntry;
    removeBox(box: any): void;
    addBin(bin: any): void;
    recalculateBin(bin: any): void;
    currentBoxes(): Box[];
}
//# sourceMappingURL=ScoreBoard.d.ts.map