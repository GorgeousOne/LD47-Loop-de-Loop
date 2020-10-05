class Hitbox {

	constructor(x, y, z, widthX, height, widthZ) {

		this.pos = createVector(x, y, z);
		this.widthX = widthX;
		this.widthZ = widthZ;
		this.height = height;
		this.outline = color(0, 0, 255);
	}

	// setSize(width, height) {
	// 	this.widthX = width;
	// 	this.height = height;
	// }

	setPos(x, y, z) {
		this.pos.set(x, y, z);
	}

	translate(dx, dy, dz) {
		this.pos.add(dx, dy, dz);
	}

	minX() {
		return this.pos.x - this.widthX/2;
	}

	maxX() {
		return this.pos.x + this.widthX/2;
	}

	minY() {
		return this.pos.y;
	}

	maxY() {
		return this.pos.y + this.height;
	}

	minZ() {
		return this.pos.z - this.widthZ/2;
	}

	maxZ() {
		return this.pos.z + this.widthZ/2;
	}

	intersects(otherBox) {
		return this.intersectsX(otherBox) && this.intersectsY(otherBox) && this.intersectsZ(otherBox) ||
			otherBox.intersectsX(this) && otherBox.intersectsY(this) && otherBox.intersectsZ(this);
	}

	intersectsX(otherBox) {
		return this.containsX(otherBox.minX()) || this.containsX(otherBox.maxX()) || otherBox.minX() < this.minX() && otherBox.maxX() > this.maxX();
	}

	intersectsY(otherBox) {
		return this.containsY(otherBox.minY()) || this.containsY(otherBox.maxY()) || otherBox.minY() < this.minY() && otherBox.maxY() > this.maxY();
	}

	intersectsZ(otherBox) {
		return this.containsZ(otherBox.minZ()) || this.containsZ(otherBox.maxZ()) || otherBox.minZ() < this.minZ() && otherBox.maxZ() > this.maxZ();
	}

	contains(x, y, z) {
		return this.containsX(x) && this.containsY(y) && this.containsZ(z);
	}

	containsX(x) {
		return x > this.minX() && x < this.maxX();
	}

	containsY(y) {
		return y > this.minY() && y < this.maxY();
	}

	containsZ(z) {
		return z > this.minZ() && z < this.maxZ();
	}

	getBoundX(dir) {
		if (dir === -1)
			return this.minX();
		else if (dir === 1)
			return this.maxX();
	}

	getBoundY(dir) {
		if (dir === -1)
			return this.minY();
		else if (dir === 1)
			return this.maxY();
	}

	getBoundZ(dir) {
		if (dir === -1)
			return this.minZ();
		else if (dir === 1)
			return this.maxZ();
	}

	display() {

		push();
		translate(
			this.pos.x,
			this.pos.y + this.height/2,
			this.pos.z);

		noFill();
		stroke(this.outline);

		box(this.widthX, this.height, this.widthZ);
		pop();
	}
}