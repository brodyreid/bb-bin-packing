export default class Box {
	width: number = 0;
	height: number = 0;
	x = 0;
    y = 0;
    constrainRotation = false;
    packed = false;

	constructor(width:number , height: number, constrainRotation = false) {
		this.width = width;
        this.height = height;
        this.constrainRotation = constrainRotation;
	}
}