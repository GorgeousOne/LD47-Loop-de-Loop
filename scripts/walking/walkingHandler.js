class WalkingHandler {

	constructor(triggerBlocks) {

		this.triggers = triggerBlocks;
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

		if (!this.currentSystem) {
			return;
		}

		if (!triggerBlocks.includes(c2)) {
			return;
		}

		let index = triggerBlocks.indexOf(c2);

		if (this.passedTrackers.length > 0 && index === this.passedTrackers[0]) {
			return;
		}

		this.passedTrackers.unshift(index);
		this.currentSystem.update(this.passedTrackers);

		if (!this.currentSystem.isCompleted()) {
			return;
		}

		this.passedTrackers = [];
		this.triggerSystems.shift();

		if (this.currentSystem.startNextTaskOnFinish) {
			this.nextSystem()
		}
	}

	createSystem1() {

		let system = new triggerSystem();
		let block = new Block(-100, 0, -100, blockSize, blockSize, blockSize);
		addPuzzleObject(block);

		let triggerTask0 = new TriggerTask(-1, () => {
			block.setPos(5*blockSize, 0, 5*blockSize);
		});

		let triggerTask1 = new TriggerTask(1, () => {
			block.setPos(blockSize, 0, 5*blockSize);
		});

		system.addTriggerAction(0, triggerTask0);
		system.addTriggerAction(1, triggerTask1);
		system.triggersForCompletion.push(3);
		system.triggersForCompletion.push(6);

		system.onCompleteAction = () => {
			floorBlocks[5].setAir(true);
			floorBlocks[7].setAir(true);
			floorBlocks[9].setAir(true);

			pitBlocks.forEach(block => {
				addPuzzleObject(block);
			})
		};

		this.triggerSystems.push(system);
	}

	createSystem2() {


	}
}