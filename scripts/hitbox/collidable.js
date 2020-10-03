class Collidable {

	constructor(x, y, z, widthX, height, widthZ, isCollidable = true, hasGravity = false) {

		this.pos = createVector(x, y, z);
		this.hitbox = new Hitbox(x, y, z, widthX, height, widthZ);

		this.velX = 0;
		this.velY = 0;
		this.velZ = 0;

		this.isSolid = isCollidable;
		this.hasGravity = hasGravity;
		this.isBeingControlled = false;
	}

	setPos(x, y, z) {
		this.pos.set(x, y, z);
		this.hitbox.setPos(x, y, z);
	}

	updateX() {
		if (this.velX !== 0)
			this.moveX(this.velX);
	}

	updateY() {
		if (this.velY !== 0)
			this.moveY(this.velY);
	}

	updateZ() {
		if (this.velZ !== 0)
			this.moveZ(this.velZ);
	}

	moveX(dx) {

		this.translateX(dx);
		let otherCollidable = physicsHandler.getCollision(this);

		if (otherCollidable === undefined)
			return dx;

		let intersection;

		if (otherCollidable.isSolid) {

			let signX = signum(dx);
			intersection = otherCollidable.hitbox.getBoundX(-signX) - this.hitbox.getBoundX(signX);
			this.translateX(intersection);
		}

		this.onCollision(otherCollidable);
		otherCollidable.onCollision(this);
	}

	moveZ(dz) {

		this.translateZ(dz);
		let otherCollidable = physicsHandler.getCollision(this);

		if (otherCollidable === undefined)
			return dz;

		this.velZ = 0;
		let intersection;

		if (otherCollidable.isSolid) {

			let signZ = signum(dz);
			intersection = otherCollidable.hitbox.getBoundZ(-signZ) - this.hitbox.getBoundZ(signZ);
			this.translateZ(intersection);
		}

		this.onCollision(otherCollidable);
		otherCollidable.onCollision(this);
	}

	moveY(dy) {

		this.translateY(dy);
		let otherCollidable = physicsHandler.getCollision(this);

		if (otherCollidable === undefined) {

			if (this.isOnGround) {
				this.velX /= 2;
				this.velZ /= 2;
			}

			this.isOnGround = false;
			return dy;
		}

		if (otherCollidable.isSolid) {

			let signY = signum(dy);
			let intersection = otherCollidable.hitbox.getBoundY(-signY) - this.hitbox.getBoundY(signY);

			this.translateY(intersection);
			this.velY = 0;

			if (!this.isBeingControlled) {
				this.velX *= friction;
				this.velZ *= friction;
			}

			if (signY === -1) {
				this.isOnGround = true;
				this.lastGround = otherCollidable;
			}

		} else if (this.isOnGround) {

			this.velX /= 2;
			this.velZ /= 2;
			this.isOnGround = false
		}

		this.onCollision(otherCollidable);
		otherCollidable.onCollision(this);
	}

	translateX(dx) {
		this.pos.add(dx, 0, 0);
		this.hitbox.move(dx, 0, 0);
	}

	translateY(dy) {
		this.pos.add(0, dy, 0);
		this.hitbox.move(0, dy, 0);
	}

	translateZ(dz) {
		this.pos.add(0, 0, dz);
		this.hitbox.move(0, 0, dz);
	}

	onCollision(otherCollidable) {
	}
}