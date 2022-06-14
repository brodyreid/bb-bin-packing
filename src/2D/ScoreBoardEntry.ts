import Bin from "./Bin";
import Box from "./Box";
import Score from "./Score";

export default class ScoreBoardEntry {
    bin: Bin;
    box: Box;
    score: Score;

    constructor(bin: Bin, box: Box) {
        this.bin = bin
        this.box = box
    }

    calculate() {
        this.score = this.bin.scoreFor(this.box);
        return this.score;
    }

    fit() {
        return !this.score.isBlank();
    }
}