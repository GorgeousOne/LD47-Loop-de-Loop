class Drawable {

	constructor(img, pos, widthX, height, widthZ, isVisible) {
		this.img = img;

		this.p0 = pos.copy().add(0, height, 0);
		this.p1 = pos.copy().add(widthX, height, widthZ);
		this.p2 = pos.copy().add(widthX, 0, widthZ);
		this.p3 = pos.copy();
	}

	display() {

		push();
		noFill();
		noStroke();

		texture(this.img);
		beginShape();
		vertex(this.p0.x, this.p0.y, this.p0.z, 0, 0);
		vertex(this.p1.x, this.p1.y, this.p1.z, this.img.width, 0);
		vertex(this.p2.x, this.p2.y, this.p2.z, this.img.width, this.img.height);
		vertex(this.p3.x, this.p3.y, this.p3.z, 0, this.img.height);
		endShape(CLOSE);
		pop();
	}
}