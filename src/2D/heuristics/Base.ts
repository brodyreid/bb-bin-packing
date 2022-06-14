import { FreeSpaceBox } from '../Bin';
import Box from '../Box';
import Score from '../Score';

export default class Base {
	findPositionForNewNode(box: Box, freeRects: FreeSpaceBox[]) {
		let bestScore = new Score();
		let width = box.width;
		let height = box.height;

		freeRects.forEach((freeRect) => {
			this.tryPlaceRectIn(freeRect, box, width, height, bestScore);
			if (!box.constrainRotation) {
				this.tryPlaceRectIn(freeRect, box, height, width, bestScore);
			}
		});

		return bestScore;
	}

	tryPlaceRectIn(freeRect, box, rectWidth, rectHeight, bestScore) {
		if (freeRect.width >= rectWidth && freeRect.height >= rectHeight) {
			let score = this.calculateScore();
			if (score < bestScore) {
				box.x = freeRect.x;
				box.y = freeRect.y;
				box.width = rectWidth;
				box.height = rectHeight;
				box.packed = true;
				bestScore.assign(score);
			}
		}
	}

	calculateScore() {
		throw 'NotImplementedError';
	}
}