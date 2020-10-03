const gravity = 0.1;
const maxVel = 50;

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

		for (let collidable of this.collidables) {

			if (collidable.hasGravity)
				collidable.velY = constrain(collidable.velY - gravity, -maxVel, maxVel);

			collidable.updateX();
			collidable.updateY();
			collidable.updateZ();
		}
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