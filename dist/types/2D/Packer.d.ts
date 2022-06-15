import Bin from './Bin';
import Box from './Box';
import ScoreBoardEntry from './ScoreBoardEntry';
declare type PackedScores<T> = Partial<ScoreBoardEntry> & {
    box: T;
};
export default class Packer {
    bins: Bin[];
    unpackedBoxes: Box[];
    constructor(bins: Bin[]);
    pack<T extends Box>(boxes: T[]): PackedScores<T>[];
}
export {};
//# sourceMappingURL=Packer.d.ts.map