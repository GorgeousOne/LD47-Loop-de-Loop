
class TriggerSystemHandler {

	constructor(triggerBlocks) {

		this.triggers = triggerBlocks;
		this.passedTriggers = [];
		this.triggerSystems = [];

		// this.createMovingBlockade();
		// this.createBlockRemover();
		// this.createPit();
		// this.createButtonPuzzle();
		this.createParkour();

		this.currentSystem = this.triggerSystems[0];
	}

	nextSystem() {

		this.triggerSystems.shift();

		if (this.triggerSystems.length > 0) {
			print("switching to next task");
			this.currentSystem = this.triggerSystems[0];
		} else {
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

		this.passedTriggers.unshift(index);
		this.currentSystem.update(this.passedTriggers);

		if (!this.currentSystem.isCompleted()) {
			return;
		}

		if (this.currentSystem.startNextTaskOnFinish) {
			this.nextSystem();
		} else {
			this.currentSystem = undefined;
		}
	}

	createMovingBlockade() {

		let system = new TriggerSystem();
		this.blockade = new Block(-300, 0, -300, blockSize, blockSize, blockSize);
		addPuzzleObject(this.blockade);

		let triggerAction0 = new TriggerAction(-1, () => {
			this.blockade.setPos(5 * blockSize, 0, 5 * blockSize);
		});

		let triggerAction1 = new TriggerAction(1, () => {
			this.blockade.setPos(blockSize, 0, 5 * blockSize);

			//pit should only be activated when walking right, so kinda reset the first trigger to pass
			// if (system.triggersForCompletion.length === 1) {
			// 	system.triggersForCompletion.push(6);
			// }
		});

		system.addTriggerAction(0, triggerAction0);
		system.addTriggerAction(1, triggerAction1);
		// system.triggersForCompletion.push(3);
		system.triggersForCompletion.push(6);

		system.onCompleteAction = () => {
			floorBlocks[5].setAir(true);
			floorBlocks[7].setAir(true);
			floorBlocks[9].setAir(true);
			lastCheckPoint = new Checkpoint(createVector(2 * blockSize, 0, 1.5 * blockSize), 0);
		};

		this.triggerSystems.push(system);
	}

	createBlockRemover() {

		let system = new TriggerSystem(false);

		system.onCompleteAction = () => {

			this.blockade.setPos(-300, 0, -300);

			pitBlocks.forEach(block => {
				block.setAir(false);
				physicsHandler.addCollidable(block);
			});
		};

		system.triggersForCompletion.push(0);
		this.triggerSystems.push(system);
	}

	createPit() {

		let system = new TriggerSystem(false);

		let removeBlockadeAction = new TriggerAction(0, () => {

			if (this.blockade.isVisible) {
				removePuzzleObject(this.blockade);
				this.blockade.isVisible = false;

				pitBlocks.forEach(block => {
					block.setAir(false);
					physicsHandler.addCollidable(block);
				});
			}
		});

		let showButtonAction = new TriggerAction(-1, () => {
			floorBlocks[5].setAir(false);
			floorBlocks[7].setAir(false);
			floorBlocks[9].setAir(false);
			pitCloseButton.isVisible = true;
		});

		let showPitAction = new TriggerAction(1, () => {
			floorBlocks[5].setAir(true);
			floorBlocks[7].setAir(true);
			floorBlocks[9].setAir(true);
			pitCloseButton.isVisible = false;
		});

		system.addTriggerAction(0, removeBlockadeAction);
		system.addTriggerAction(4, showButtonAction);
		system.addTriggerAction(5, showPitAction);

		system.onCompleteAction = () => {
			pitBlocks.forEach(block => {
				block.setAir(true);
				physicsHandler.removeCollidable(block);
			});
		};

		this.triggerSystems.push(system);
	}

	createButtonPuzzle() {

		let system = new TriggerSystem(true);

		let showMural = new TriggerAction(1, () => {

			if (pitCloseButton.isVisible) {

				pitCloseButton.isVisible = false;
				wallMural.isVisible = true;
				system.setCompleted();
			}
		});

		system.addTriggerAction(5, showMural);

		this.triggerSystems.push(system);
	}

	createParkour() {

		let system = new TriggerSystem(true);

		let showButtonPuzzle = new TriggerAction(1, () => {
			system.setCompleted();
			fiveButtons.forEach(button => button.isVisible = true);
		});

		system.addTriggerAction(2, showButtonPuzzle);

		system.onCompleteAction = () => {

			floorBlocks[0].setAir(true);
			floorBlocks[1].setAir(true);
			floorBlocks[5].setAir(true);
			floorBlocks[7].setAir(true);
			floorBlocks[9].setAir(true);
			floorBlocks[11].setAir(true);
			floorBlocks[12].setAir(true);

			crackedBlocks.forEach(block => {
				block.setAir(false);
				physicsHandler.addCollidable(block);
			});

			lastCheckPoint = new Checkpoint(createVector(1.5 * blockSize, 0, 3.5 * blockSize), 270);
			lastCheckPoint.onResetLv = () => crackedBlocks.forEach(block => block.replace());
		};

		this.triggerSystems.push(system);
	};
}