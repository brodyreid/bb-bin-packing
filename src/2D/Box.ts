export default class Box {
	width: number = 0;
	height: number = 0;
	constrainRotation = false;
	x = 0;
	y = 0;
	packed = false;

	constructor(width:number , height: number, constrainRotation = false) {
		this.width = width;
		this.height = height;

		// Avoid the packer to try the rotated dimensions
		this.constrainRotation = constrainRotation;
	}

	rotate() {
		let { width, height } = this;
		this.width = height;
		this.height = width;
	}

	get label() {
		return `${this.width}x${this.height} at [${this.x},${this.y}]`;
	}

	get area() {
		return this.width * this.height;
	}
}