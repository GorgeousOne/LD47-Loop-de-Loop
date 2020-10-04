class Block extends Collidable {

	constructor(x, y, z, widthX, height, widthZ) {

		super(x + widthX / 2, y, z + widthZ / 2, widthX, height, widthZ);

		this.isVisible = true;
	}

	//do i need to override that?
	setPos(x, y, z) {
		this.pos.set(x + this.hitbox.widthX / 2, y, z + this.hitbox.widthZ / 2);
		this.hitbox.setPos(this.pos.x, this.pos.y, this.pos.z);
	}

	display(c = color(255)) {

		if (this.isVisible) {
			push();
			fill(c);
			translate(this.pos.x, this.pos.y + this.hitbox.height / 2, this.pos.z);
			box(this.hitbox.widthX, this.hitbox.height, this.hitbox.widthZ);
			pop();
		}

		if (showHitboxes) {
			this.hitbox.display();
		}
	}
}