import Bin from "./Bin";
import Box from "./Box";
import Score from "./Score";
export default class ScoreBoardEntry {
    bin: Bin;
    box: Box;
    score: Score;
    constructor(bin: Bin, box: Box);
    calculate(): Score;
    fit(): boolean;
}
//# sourceMappingURL=ScoreBoardEntry.d.ts.map