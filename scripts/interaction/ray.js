
class Ray {

	constructor(origin, direction, length) {
		this.origin = origin.copy();
		this.direction = direction.copy().normalize().mult(length);
	}

	getOrigin() {
		return this.origin.copy();
	}

	getDirection() {
		return this.direction.copy();
	}

	getPoint(delta) {
		if (delta < 0 || delta > 1)
			return undefined;
		else
			return this.getOrigin().add(this.getDirection().mult(delta));
	}
}
