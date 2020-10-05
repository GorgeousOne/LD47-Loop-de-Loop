class Checkpoint {

	constructor(pos, yaw) {
		this.pos = pos;
		this.yaw = yaw;
		this.onResetLv = undefined;
	}

	tpPlayer() {

		player.setPos(this.pos.x, this.pos.y, this.pos.z);
		player.yaw = this.yaw;
		player.pitch = 0;
		player.velX = 0;
		player.velY = 0;
		player.velZ = 0;

		if(this.onResetLv) {
			this.onResetLv();
		}
	}
}