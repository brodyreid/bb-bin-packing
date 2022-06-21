import Bin from './Bin';
import Box from './Box';
import { PackedScores } from './Types';
export default class Packer {
    bins: Bin[];
    unpackedBoxes: Box[];
    constructor(bins: Bin[]);
    pack<T extends Box>(boxes: T[]): PackedScores<T>[];
}
//# sourceMappingURL=Packer.d.ts.map