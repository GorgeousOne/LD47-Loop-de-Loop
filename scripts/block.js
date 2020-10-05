class Block extends Collidable {

	constructor(x, y, z, widthX, height, widthZ) {

		super(x + widthX / 2, y, z + widthZ / 2, widthX, height, widthZ);
		this.color = color(255);
		this.texture = undefined;
		this.isVisible = true;
		this.lastFixedPos = this.getPos();
	}

	//do i need to override that?
	setPos(x, y, z) {
		this.pos.set(x + this.hitbox.widthX / 2, y, z + this.hitbox.widthZ / 2);
		this.hitbox.setPos(this.pos.x, this.pos.y, this.pos.z);

		if (this.isRigid) {
			this.lastFixedPos = this.getPos();
		}
	}

	getPos() {
		return createVector(
			this.pos.x - this.hitbox.widthX / 2,
			this.pos.y,
			this.pos.z - this.hitbox.widthZ / 2);
	}

	setAir(state) {
		this.isVisible = !state;
		this.isSolid = !state;
	}

	setFalling() {
		this.isAboutToFall = false;
		this.isRigid = false;
		this.isSolid = false;
	}

	replace() {
		this.setAir(false);
		this.isRigid = true;
		this.velX = 0;
		this.velY = 0;
		this.velZ = 0;
		this.setPos(this.lastFixedPos.x, this.lastFixedPos.y, this.lastFixedPos.z);
	}

	display() {

		if (this.isVisible) {

			push();

			if (this.texture !== undefined) {
				texture(this.texture);
			}else {
				fill(this.color);
			}

			translate(this.pos.x, this.pos.y + this.hitbox.height / 2, this.pos.z);
			box(this.hitbox.widthX, this.hitbox.height, this.hitbox.widthZ);
			pop();
		}

		if (showHitboxes) {
			this.hitbox.display();
		}
	}
}