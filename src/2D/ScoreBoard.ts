// #       box_1 box_2 box_3 ...
// # bin_1  100   200    0
// # bin_2   0     5     0
// # bin_3   9    100    0
// # ...
import Bin from './Bin';
import Box from './Box';
import ScoreBoardEntry from './ScoreBoardEntry';

export default class ScoreBoard {
	entries: ScoreBoardEntry[] = [];

	constructor(bins: Bin[], boxes: Box[]) {
		bins.forEach((bin) => {
			this.addBinEntries(bin, boxes);
		});
	}

	debug() {
		require('console.table');
		console.table(
			this.entries.map((entry) => ({
				bin: entry.bin.label,
				score: entry.score,
			}))
		);
	}

	addBinEntries(bin, boxes) {
		boxes.forEach((box) => {
			let entry = new ScoreBoardEntry(bin, box);
			entry.calculate();
			this.entries.push(entry);
		});
	}

	largestNotFitingBox() {
        let unfit: ScoreBoardEntry;
		let fittingBoxes = this.entries
			.filter((entry) => entry.fit)
			.map((entry) => entry.box);

        this.entries.forEach((entry) => {
            const unfitArea = unfit.box.width * unfit.box.height;
            const entryArea = entry.box.width * entry.box.height;
			if (!fittingBoxes.includes(entry.box)) {
				return;
			}
			if (unfit === null || unfitArea < entryArea) {
				unfit = entry;
			}
		});

		return unfit.box ? unfit : false;
	}

	bestFit() {
		let best: ScoreBoardEntry | null = null;
		for (let i = 0; i < this.entries.length; i++) {
			let entry = this.entries[i];
			if (!entry.fit()) {
				continue;
			}
			if (best === null || entry.score < best.score) {
				best = entry;
			}
		}
		return best;
	}

	removeBox(box) {
		this.entries = this.entries.filter((entry) => {
			return entry.box !== box;
		});
	}

	addBin(bin) {
		this.addBinEntries(bin, this.currentBoxes());
	}

	recalculateBin(bin) {
		this.entries
			.filter((entry) => entry.bin === bin)
			.forEach((entry) => entry.calculate());
	}

	currentBoxes() {
		return [...new Set(this.entries.map((entry) => entry.box))];
	}
}
