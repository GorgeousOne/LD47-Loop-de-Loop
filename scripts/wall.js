
class Wall extends Collidable {

	constructor(x, y, z, widthX, height, widthZ) {
		super(x, y, z, widthX, height, widthZ);
	}

	display() {

		push();
		translate(this.pos.x + this.hitbox.widthX/2, this.pos.y + this.hitbox.height/2, this.pos.z + this.hitbox.widthZ/2);
		box(this.hitbox.widthX, this.hitbox.height, this.hitbox.widthZ);
		pop();
	}
}