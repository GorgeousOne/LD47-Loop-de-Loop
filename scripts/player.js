const maxSpeedForwards = 4;

class Player extends Collidable {

	constructor() {

		super(0, 0, 150, 20, 80, 20, false, true);

		this.yaw = 270;
		this.pitch = 0;

		perspective(radians(60), width/height, this.hitbox.widthX/3, 1000)
	}

	eyeX() {
		return this.pos.x + this.hitbox.widthX/2;
	}

	eyeY() {
		return this.pos.y + this.hitbox.height;
	}

	eyeZ() {
		return this.pos.z + this.hitbox.widthZ/2;
	}

	eyeLoc() {
		return createVector(this.eyeX(), this.eyeY(), this.eyeZ());
	}

	dirX() {
		return cos(radians(this.pitch)) * cos(radians(this.yaw));
	}

	dirY() {
		return sin(radians(this.pitch));
	}

	dirZ() {
		return cos(radians(this.pitch)) * sin(radians(this.yaw));
	}

	facing() {
		return createVector(this.dirX(), this.dirY(), this.dirZ());
	}

	focus() {

		let eyeX = this.eyeX();
		let eyeY = this.eyeY();
		let eyeZ = this.eyeZ();

		camera(
			eyeX,
			eyeY,
			eyeZ,
			eyeX + this.dirX(),
			eyeY + this.dirY(),
			eyeZ + this.dirZ(),
			0, -1, 0);
	}

	move(motForwards, motSidewards) {

		this.isBeingControlled = true;

		this.velX += motForwards * cos(radians(this.yaw)) + motSidewards * sin(radians(this.yaw));
		this.velZ += motForwards * sin(radians(this.yaw)) + -motSidewards * cos(radians(this.yaw));

		let totalVel = sqrt(pow(this.velX, 2) + pow(this.velZ, 2));

		if (totalVel > maxSpeedForwards) {
			this.velX *= maxSpeedForwards / totalVel;
			this.velZ *= maxSpeedForwards / totalVel;
		}
	}

	jump(force) {

		if (this.isOnGround) {

			this.velX /= 2;
			this.velZ /= 2;
			this.velY = force;
			this.isOnGround = false;
		}
	}

	rotate(dYaw, dPitch) {

		this.yaw += dYaw;
		this.pitch += dPitch;

		this.yaw %= 360;
		this.pitch = min(89.9, max(-89.9, this.pitch));
	}
}