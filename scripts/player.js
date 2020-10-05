// const maxSpeed = 15;
const maxSpeed = 7;
const FOV = 70;

class Player extends Collidable {

	constructor(x, y, z, yaw) {

		super(x, y, z, 20, 80, 20, false, false, true);

		this.yaw = yaw;
		this.pitch = 0;

		this.applyFOV();
		this.hitbox.outline = color(0, 255, 0);
	}

	eyeX() {
		return this.pos.x;
	}

	eyeY() {
		return this.pos.y + this.hitbox.height;
	}

	eyeZ() {
		return this.pos.z;
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

	applyFOV() {
		perspective(radians(FOV), width/height, this.hitbox.widthX/3, 2500)
	}

	applyCam() {

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

		if (totalVel > maxSpeed) {
			this.velX *= maxSpeed / totalVel;
			this.velZ *= maxSpeed / totalVel;
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

	display() {
		this.hitbox.display();
	}
}