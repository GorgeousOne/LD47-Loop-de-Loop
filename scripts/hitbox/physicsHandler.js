const gravity = 0.3;
const maxVel = 50;
const friction = 0.8;

class PhysicsHandler {

	constructor() {
		this.collidables = [];
		this.collisionListeners = []
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

	removeListener(listener) {

		for(let i = 0; i < this.collisionListeners.length; i++) {
			if (this.collisionListeners[i] === listener) {
				this.collisionListeners.splice(i, 1);
				return;
			}
		}
	}

	applyPhysics() {

		this.collidables.forEach(collidable => {

			if (collidable.hasGravity)
				collidable.velY = constrain(collidable.velY - gravity, -maxVel, maxVel);

			collidable.updateY(this.collidables);
			collidable.updateX(this.collidables);
			collidable.updateZ(this.collidables);
			collidable.isBeingControlled = false;
		});
	}

	callCollision(c1, c2) {
		this.collisionListeners.forEach(listener => {
			listener.onCollision(c1, c2);
		});
	}
}