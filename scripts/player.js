class Player extends Collidable {

	constructor() {

		super(0, 0, 150, 20, 80, 20, false, true);

		this.yaw = 270;
		this.pitch = 0;

		perspective(radians(60), width/height, 10, 500)
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

	focus() {

		let eyeX = this.eyeX();
		let eyeY = this.eyeY();
		let eyeZ = this.eyeZ();

		let dirY = sin(radians(this.pitch));
		let dirX = cos(radians(this.pitch)) * cos(radians(this.yaw));
		let dirZ = cos(radians(this.pitch)) * sin(radians(this.yaw));

		camera(
			eyeX,
			eyeY,
			eyeZ,
			eyeX + dirX,
			eyeY + dirY,
			eyeZ + dirZ,
			0, -1, 0);
	}

	move(motForwards, motSidewards) {
		this.velX = motForwards * cos(radians(this.yaw)) + motSidewards * sin(radians(this.yaw));
		this.velZ = motForwards * sin(radians(this.yaw)) + -motSidewards * cos(radians(this.yaw));
	}

	jump(force) {
		if (this.isOnGround) {
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