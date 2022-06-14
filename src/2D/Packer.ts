import Bin from './Bin';
import Box from './Box';
import Score from './Score';
import ScoreBoard from './ScoreBoard';
import ScoreBoardEntry from './ScoreBoardEntry';

export default class Packer {
	bins: Bin[] = [];
	unpackedBoxes: Box[] = [];

	constructor(bins: Bin[]) {
		this.bins = bins;
	}

	pack(boxes: Box[], options: { limit?: number } = {}) {
        let packedBoxes: Partial<ScoreBoardEntry>[] = [];
        let entry: ScoreBoardEntry | null;

		boxes = boxes.filter((box) => !box.packed);
		if (boxes.length === 0) return packedBoxes;

		let limit = options.limit || Score.MAX_INT;
		let board = new ScoreBoard(this.bins, boxes);
		while ((entry = board.bestFit())) {
			entry.bin.insert(entry.box);
			board.removeBox(entry.box);
			board.recalculateBin(entry.bin);
            packedBoxes.push({box: entry.box, score: entry.score});
			if (packedBoxes.length >= limit) {
				break;
			}
		}

		this.unpackedBoxes = boxes.filter((box) => {
			return !box.packed;
		});

		return packedBoxes;
	}
}