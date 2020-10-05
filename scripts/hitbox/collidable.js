class Collidable {

	constructor(x, y, z, widthX, height, widthZ, isCollidable = true, isRigid = true, hasGravity = false) {

		this.pos = createVector(x, y, z);
		this.hitbox = new Hitbox(x, y, z, widthX, height, widthZ);

		this.velX = 0;
		this.velY = 0;
		this.velZ = 0;

		this.isSolid = isCollidable;
		this.isRigid = isRigid;
		this.hasGravity = hasGravity;

		this.isOnGround = false;
		this.isBeingControlled = false;
	}

	setPos(x, y, z) {
		this.pos.set(x, y, z);
		this.hitbox.setPos(x, y, z);
	}

	translate(dx, dy, dz) {
		this.pos.add(dx, dy, dz);
		this.hitbox.translate(dx, dy, dz);
	}

	updateX(collidables) {
		if (this.velX !== 0)
			this.moveX(this.velX, collidables);
	}

	updateY(collidables) {
		if (this.velY !== 0)
			this.moveY(this.velY, collidables);
	}

	updateZ(collidables) {
		if (this.velZ !== 0)
			this.moveZ(this.velZ, collidables);
	}

	moveX(dx, collidables) {

		this.translateX(dx);
		let intersections = this.getIntersections(collidables);

		if (intersections.length === 0) {
			return;
		}

		for (let otherCollidable of intersections) {

			if (otherCollidable.isSolid) {

				let intersectionDir = Math.sign(dx);
				let intersection = otherCollidable.hitbox.getBoundX(-intersectionDir) - this.hitbox.getBoundX(intersectionDir);
				this.translateX(intersection);
				this.velX = 0;
			}

			physicsHandler.callCollision(this, otherCollidable);
		}
	}

	moveZ(dz, collidables) {

		this.translateZ(dz);
		let intersections = this.getIntersections(collidables);

		if (intersections.length === 0) {
			return;
		}

		for (let otherCollidable of intersections) {

			if (otherCollidable.isSolid) {

				let intersectionDir = Math.sign(dz);
				let intersection = otherCollidable.hitbox.getBoundZ(-intersectionDir) - this.hitbox.getBoundZ(intersectionDir);
				this.translateZ(intersection);
				this.velZ = 0;
			}

			physicsHandler.callCollision(this, otherCollidable);
		}
	}

	moveY(dy, collidables) {

		this.translateY(dy);
		let intersections = this.getIntersections(collidables);

		if (intersections.length === 0) {
			//half the velocity when losing ground
			if (this.isOnGround) {
				this.velX /= 2;
				this.velZ /= 2;
				this.isOnGround = false;
				return;
			}
		}

		for (let otherCollidable of intersections) {

			if (otherCollidable.isSolid) {

				let intersectionDir = Math.sign(dy);
				let intersection = otherCollidable.hitbox.getBoundY(-intersectionDir) - this.hitbox.getBoundY(intersectionDir);

				this.translateY(intersection);
				this.velY = 0;

				//dont apply floor friction when being player controlled
				if (!this.isBeingControlled) {
					this.velX *= friction;
					this.velZ *= friction;
				}

				physicsHandler.callCollision(this, otherCollidable);

				if (intersectionDir === -1) {
					this.isOnGround = true;
				}
			}
		}
	}

	getIntersections(collidables) {

		let intersections = [];

		for (let other of collidables) {
			if (other !== this && this.hitbox.intersects(other.hitbox)) {
				intersections.push(other);
			}
		}

		return intersections;
	}

	translateX(dx) {
		this.pos.add(dx, 0, 0);
		this.hitbox.translate(dx, 0, 0);
	}

	translateY(dy) {
		this.pos.add(0, dy, 0);
		this.hitbox.translate(0, dy, 0);
	}

	translateZ(dz) {
		this.pos.add(0, 0, dz);
		this.hitbox.translate(0, 0, dz);
	}
}