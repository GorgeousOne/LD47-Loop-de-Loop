class WalkingHandler {

	constructor(trackerBlocks) {

		this.trackers = trackerBlocks;
		this.passedTrackers = [];
		this.triggerSystems = [];

		this.createSystem1();
		this.nextSystem();
	}

	nextSystem() {

		if (this.triggerSystems.length > 0) {
			this.currentSystem = this.triggerSystems[0];
		}
	}

	onCollision(c1, c2) {

		if (!trackerBlocks.includes(c2)) {
			return;
		}

		let index = trackerBlocks.indexOf(c2);

		if (this.passedTrackers.length > 0 && index === this.passedTrackers[0]) {
			return;
		}

		print("triggered trigger " + index);
		this.passedTrackers.unshift(index);
		this.currentSystem.update(this.passedTrackers);

		if (!this.currentSystem.isCompleted()) {
			return;
		}

		this.passedTrackers = [];
		this.triggerSystems.shift();

		if (this.triggerSystems.length === 0) {
			gameIsPaused = true;
			physicsHandler.removeListener(this);
			return;
		}

		if (this.currentSystem.startNextTaskOnFinish) {
			this.currentSystem = this.triggerSystems[0];
		}
	}

	createSystem1() {

		let system = new triggerSystem();
		let block = new Block(-100, 0, -100, blockSize, blockSize, blockSize);

		physicsHandler.addCollidable(block);
		rndPuzzleStuff.push(block);

		let triggerTask0 = new TriggerTask(-1, () => {
			block.setPos(1000, 0, 1000);
		});

		let triggerTask1 = new TriggerTask(1, () => {
			block.setPos(200, 0, 1000);
		});

		system.onCompleteAction = () => {
			physicsHandler.removeCollidable(block);
			rndPuzzleStuff.shift();
		};

		system.addTriggerAction(0, triggerTask0);
		system.addTriggerAction(1, triggerTask1);
		system.triggersForCompletion.push(2);
		system.triggersForCompletion.push(3);

		this.triggerSystems.push(system);
	}
}