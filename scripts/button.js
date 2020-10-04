
class Button extends Interactable {

	constructor(pos, size, depth, facing) {

		super();

		let widthX;
		let height;
		let widthZ;

		if (facing.x !== 0) {
			widthX = depth;
			height = size;
			widthZ = size;

		}else if (facing.z !== 0) {
			widthX = size;
			height = size;
			widthZ = depth;

		}else {
			widthX = size;
			height = depth;
			widthZ = size;
		}

		let v = [
			createVector(pos.x - widthX/2, pos.y - height/2, pos.z - widthZ/2),
			createVector(pos.x + widthX/2, pos.y - height/2, pos.z - widthZ/2),
			createVector(pos.x + widthX/2, pos.y - height/2, pos.z + widthZ/2),
			createVector(pos.x - widthX/2, pos.y - height/2, pos.z + widthZ/2),
			createVector(pos.x - widthX/2, pos.y + height/2, pos.z - widthZ/2),
			createVector(pos.x + widthX/2, pos.y + height/2, pos.z - widthZ/2),
			createVector(pos.x + widthX/2, pos.y + height/2, pos.z + widthZ/2),
			createVector(pos.x - widthX/2, pos.y + height/2, pos.z + widthZ/2),
		];

		this.faces.push(new Face(v[0], v[4], v[7]));
		this.faces.push(new Face(v[0], v[7], v[3]));
		this.faces.push(new Face(v[1], v[2], v[6]));
		this.faces.push(new Face(v[1], v[6], v[5]));

		this.faces.push(new Face(v[0], v[1], v[2]));
		this.faces.push(new Face(v[0], v[2], v[3]));
		this.faces.push(new Face(v[4], v[7], v[6]));
		this.faces.push(new Face(v[4], v[6], v[5]));

		this.faces.push(new Face(v[0], v[1], v[5]));
		this.faces.push(new Face(v[0], v[5], v[4]));
		this.faces.push(new Face(v[3], v[2], v[6]));
		this.faces.push(new Face(v[3], v[6], v[7]));
	}
}