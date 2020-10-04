const gravity = 0.2;
const maxVel = 50;
const friction = 0.8;

class PhysicsHandler {

	constructor() {
		this.collidables = [];
	}

	addCollidable(collidable) {
		this.collidables.push(collidable);
	}

	removeCollidable(collidable) {

		if(!collidable)
			throw 'could not remove undefined collidable';

		for(let i = 0; i < this.collidables.length; i++) {

			if (this.collidables[i] === collidable) {

				this.collidables.splice(i, 1);
				return;
			}
		}
	}

	applyPhysics() {

		this.collidables.forEach(collidable => {

			if (collidable.hasGravity)
				collidable.velY = constrain(collidable.velY - gravity, -maxVel, maxVel);

			collidable.updateY();
			collidable.updateX();
			collidable.updateZ();
			collidable.isBeingControlled = false;
		});
	}

	getCollision(collidable) {

		for (let other of this.collidables) {

			if (other === collidable || !other.isSolid)
				continue;

			if (collidable.hitbox.intersects(other.hitbox))
				return other;
		}
	}
}