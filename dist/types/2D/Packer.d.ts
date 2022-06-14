import Bin from './Bin';
import Box from './Box';
import ScoreBoardEntry from './ScoreBoardEntry';
export default class Packer {
    bins: Bin[];
    unpackedBoxes: Box[];
    constructor(bins: Bin[]);
    pack(boxes: Box[], options?: {
        limit?: number;
    }): Partial<ScoreBoardEntry>[];
}
//# sourceMappingURL=Packer.d.ts.map