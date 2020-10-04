
class Button extends Interactable {

	constructor(pos, size, depth, facing) {

		super();

		this.pos = pos;
		this.widthX;
		this.height;
		this.widthZ;

		if (facing.x !== 0) {
			this.widthX = depth;
			this.height = size;
			this.widthZ = size;

		}else if (facing.z !== 0) {
			this.widthX = size;
			this.height = size;
			this.widthZ = depth;

		}else {
			this.widthX = size;
			this.height = depth;
			this.widthZ = size;
		}

		let v = [
			createVector(pos.x - this.widthX/2, pos.y - this.height/2, pos.z - this.widthZ/2),
			createVector(pos.x + this.widthX/2, pos.y - this.height/2, pos.z - this.widthZ/2),
			createVector(pos.x + this.widthX/2, pos.y - this.height/2, pos.z + this.widthZ/2),
			createVector(pos.x - this.widthX/2, pos.y - this.height/2, pos.z + this.widthZ/2),
			createVector(pos.x - this.widthX/2, pos.y + this.height/2, pos.z - this.widthZ/2),
			createVector(pos.x + this.widthX/2, pos.y + this.height/2, pos.z - this.widthZ/2),
			createVector(pos.x + this.widthX/2, pos.y + this.height/2, pos.z + this.widthZ/2),
			createVector(pos.x - this.widthX/2, pos.y + this.height/2, pos.z + this.widthZ/2),
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

	display(color = color(255, 10, 0)) {

		fill(color);
		translate(this.pos.x, this.pos.y, this.pos.z);
		box(this.widthX, this.height, this.widthZ);
	}
}