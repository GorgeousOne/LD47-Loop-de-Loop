
class Button extends Interactable {

	constructor(x, y, z, size, depth, facing, isVisible = true) {

		super();
		this.color = color(255, 10, 10);
		this.hoverColor = color(255, 70, 40);

		this.isVisible = isVisible;
		this.pos = createVector(x, y, z);

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
			createVector(this.pos.x - this.widthX/2, this.pos.y - this.height/2, this.pos.z - this.widthZ/2),
			createVector(this.pos.x + this.widthX/2, this.pos.y - this.height/2, this.pos.z - this.widthZ/2),
			createVector(this.pos.x + this.widthX/2, this.pos.y - this.height/2, this.pos.z + this.widthZ/2),
			createVector(this.pos.x - this.widthX/2, this.pos.y - this.height/2, this.pos.z + this.widthZ/2),
			createVector(this.pos.x - this.widthX/2, this.pos.y + this.height/2, this.pos.z - this.widthZ/2),
			createVector(this.pos.x + this.widthX/2, this.pos.y + this.height/2, this.pos.z - this.widthZ/2),
			createVector(this.pos.x + this.widthX/2, this.pos.y + this.height/2, this.pos.z + this.widthZ/2),
			createVector(this.pos.x - this.widthX/2, this.pos.y + this.height/2, this.pos.z + this.widthZ/2),
		];

		this.clickableFaces.push(new Face(v[0], v[4], v[7]));
		this.clickableFaces.push(new Face(v[0], v[7], v[3]));
		this.clickableFaces.push(new Face(v[1], v[2], v[6]));
		this.clickableFaces.push(new Face(v[1], v[6], v[5]));

		this.clickableFaces.push(new Face(v[0], v[1], v[2]));
		this.clickableFaces.push(new Face(v[0], v[2], v[3]));
		this.clickableFaces.push(new Face(v[4], v[7], v[6]));
		this.clickableFaces.push(new Face(v[4], v[6], v[5]));

		this.clickableFaces.push(new Face(v[0], v[1], v[5]));
		this.clickableFaces.push(new Face(v[0], v[5], v[4]));
		this.clickableFaces.push(new Face(v[3], v[2], v[6]));
		this.clickableFaces.push(new Face(v[3], v[6], v[7]));
	}

	display() {

		if (!this.isVisible) {
			return;
		}

		push();
		fill(!this.isEnabled ? color(128) : this.isHovered ? this.hoverColor : this.color);
		translate(this.pos.x, this.pos.y, this.pos.z);
		box(this.widthX, this.height, this.widthZ);
		pop();
	}
}