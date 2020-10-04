let gameIsClockWise;

class WalkingHandler {

	constructor(triggerBlocks) {

		this.triggers = triggerBlocks;
		this.passedTriggers = [];
		this.triggerSystems = [];

		this.createSystem1();
		this.nextSystem();
	}

	nextSystem() {

		if (this.triggerSystems.length > 0) {
			print("switching to next task");
			this.currentSystem = this.triggerSystems[0];
		}else {
			this.currentSystem = undefined;
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

		if (this.passedTriggers.length > 0 && index === this.passedTriggers[0]) {
			return;
		}

		if (this.passedTriggers.length > 0) {
			print("passing " + index + " prev: " + this.passedTriggers[0]);
		}

		this.passedTriggers.unshift(index);
		this.currentSystem.update(this.passedTriggers);

		if (!this.currentSystem.isCompleted()) {
			return;
		}

		this.triggerSystems.shift();

		if (this.currentSystem.startNextTaskOnFinish) {
			this.nextSystem();
		}else {
			print("RESET");
			this.currentSystem = undefined;
		}
	}

	createSystem1() {

		let system = new TriggerSystem();
		this.blockade = new Block(-300, 0, -300, blockSize, blockSize, blockSize);
		addPuzzleObject(this.blockade);

		let triggerAction0 = new TriggerAction(-1, () => {
			this.blockade.setPos(5 * blockSize, 0, 5 * blockSize);
		});

		let triggerAction1 = new TriggerAction(1, () => {
			this.blockade.setPos(blockSize, 0, 5 * blockSize);
		});

		system.addTriggerAction(0, triggerAction0);
		system.addTriggerAction(1, triggerAction1);
		system.triggersForCompletion.push(3);
		system.triggersForCompletion.push(6);

		system.onCompleteAction = () => {
			floorBlocks[5].setAir(true);
			floorBlocks[7].setAir(true);
			floorBlocks[9].setAir(true);
			this.createSystem2();
		};

		this.triggerSystems.push(system);
	}

	createSystem2() {

		print("creating second task");
		let system = new TriggerSystem();
		gameIsClockWise = this.passedTriggers[0] === 6;

		system.triggersForCompletion.push(gameIsClockWise ? 0 : 1);
		system.onCompleteAction = () => {
			print("remove blockade");
			removePuzzleObject(this.blockade);
			this.createSystem3();
		};

		this.triggerSystems.push(system);
	}

	createSystem3() {

		let system = new TriggerSystem(false);

		let showButtonAction = new TriggerAction(gameIsClockWise ? -1 : 1, () => {
			floorBlocks[5].setAir(false);
			floorBlocks[7].setAir(false);
			floorBlocks[9].setAir(false);
			pitCloseButton.isVisible = true;
		});

		let showPitAction = new TriggerAction(gameIsClockWise ? 1 : -1, () => {
			floorBlocks[5].setAir(true);
			floorBlocks[7].setAir(true);
			floorBlocks[9].setAir(true);
			pitCloseButton.isVisible = false;
		});

		system.addTriggerAction(gameIsClockWise ? 4 : 5, showButtonAction);
		system.addTriggerAction(gameIsClockWise ? 5 : 4, showPitAction);
		this.triggerSystems.push(system);

		system.onCompleteAction = () => {
			floorBlocks[5].setAir(false);
			floorBlocks[7].setAir(false);
			floorBlocks[9].setAir(false);
			pitCloseButton.isVisible = false;
		}
	}
}