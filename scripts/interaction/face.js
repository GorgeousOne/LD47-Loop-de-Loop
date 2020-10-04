const threshold = 0;

class Face {

	constructor(p0, p1, p2) {
		this.p0 = p0;
		this.p1 = p1;
		this.p2 = p2;

		if ((p0.x !== p1.x || p0.x !== p2.x) &&
			(p0.y !== p1.y || p0.y !== p2.y)) {
			this.signFunction = this.signXY;

		}else if (
			(p0.y !== p1.y || p0.y !== p2.y) &&
			(p0.z !== p1.z || p0.z !== p2.z)) {
			this.signFunction = this.signYZ;

		}else {
			this.signFunction = this.signXZ;
		}
	}

	display() {

		let normal = this.getNormal();

		beginShape(TRIANGLES);
		// normal(normal.x, normal.y, normal.z);
		vertex(this.p0.x, this.p0.y, this.p0.z);
		vertex(this.p1.x, this.p1.y, this.p1.z);
		vertex(this.p2.x, this.p2.y, this.p2.z);
		endShape(CLOSE);
	}

	getNormal() {
		let v0 = this.p1.copy().sub(this.p0);
		let v1 = this.p2.copy().sub(this.p0);
		return v0.cross(v1);
	}

	intersects(ray) {

		let v0 = this.p1.copy().sub(this.p0);
		let v1 = this.p2.copy().sub(this.p0);

		let normal = v0.cross(v1);
		let dirsDotProduct = normal.dot(ray.getDirection());

		if (dirsDotProduct === 0) {
			return undefined;
		}

		let delta = this.p0.copy().sub(ray.getOrigin()).dot(normal) / dirsDotProduct;
		let intersection = ray.getPoint(delta);

		if (intersection) {
			return this.contains(intersection);
		}else {
			return undefined;
		}
	}

	contains(point) {

		let d1 = this.signFunction(point, this.p0, this.p1);
		let d2 = this.signFunction(point, this.p1, this.p2);
		let d3 = this.signFunction(point, this.p2, this.p0);

		let hasNegativeCoordinate = (d1 < threshold) || (d2 < threshold) || (d3 < threshold);
		let hasPositiveCoordinate = (d1 > threshold) || (d2 > threshold) || (d3 > threshold);

		return !(hasNegativeCoordinate && hasPositiveCoordinate);
	}

	signXY(p, v0, v1) {
		return (p.x - v1.x) * (v0.y - v1.y) - (v0.x - v1.x) * (p.y - v1.y);
	}

	signYZ(p, v0, v1) {
		return (p.z - v1.z) * (v0.y - v1.y) - (v0.z - v1.z) * (p.y - v1.y);
	}

	signXZ(p, v0, v1) {
		return (p.z - v1.z) * (v0.x - v1.x) - (v0.z - v1.z) * (p.x - v1.x);
	}
}