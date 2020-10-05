
class TriggerSystemHandler {

	constructor(triggerBlocks) {

		this.triggers = triggerBlocks;
		this.passedTriggers = [];
		this.triggerSystems = [];

		this.createMovingBlockade();
		this.createBlockRemover();
		this.createPitPuzzle();
		this.createRemovePit();
		this.createFiveButtons();

		this.currentSystem = this.triggerSystems[0];
	}

	nextSystem() {

		this.triggerSystems.shift();

		if (this.triggerSystems.length > 0) {
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
		addPuzzleObject(blockade);

		let triggerAction0 = new TriggerAction(-1, () => {
			blockade.setPos(5 * blockSize, 0, 5 * blockSize);
		});

		let triggerAction1 = new TriggerAction(1, () => {
			blockade.setPos(blockSize, 0, 5 * blockSize);

			//pit should only be activated when walking right, so kinda reset the first trigger to pass
			if (system.triggersForCompletion.length === 1) {
				system.triggersForCompletion.push(6);
			}
		});

		system.addTriggerAction(0, triggerAction0);
		system.addTriggerAction(1, triggerAction1);
		system.triggersForCompletion.push(3);
		system.triggersForCompletion.push(6);

		system.onCompleteAction = () => {
			floorBlocks[5].setAir(true);
			floorBlocks[7].setAir(true);
			floorBlocks[9].setAir(true);

			pitBlocks.forEach(block => {
				block.setAir(false);
				addPuzzleObject(block);
			});

			lastCheckPoint = new Checkpoint(createVector(2 * blockSize, 0, 1.5 * blockSize), 0);
		};

		this.triggerSystems.push(system);
	}

	createBlockRemover() {

		let system = new TriggerSystem();

		system.onCompleteAction = () => {removePuzzleObject(blockade)};
		system.triggersForCompletion.push(0);
		this.triggerSystems.push(system);
	}

	createPitPuzzle() {

		let system = new TriggerSystem();

		let showButtonAction = new TriggerAction(-1, () => {
			floorBlocks[5].setAir(false);
			floorBlocks[7].setAir(false);
			floorBlocks[9].setAir(false);

			addPuzzleObject(pitCloseButton);
		});

		let showPitAction = new TriggerAction(1, () => {
			floorBlocks[5].setAir(true);
			floorBlocks[7].setAir(true);
			floorBlocks[9].setAir(true);

			removePuzzleObject(pitCloseButton);
		});

		system.addTriggerAction(4, showButtonAction);
		system.addTriggerAction(5, showPitAction);

		system.onCompleteAction = () => {
			pitBlocks.forEach(block => {
				removePuzzleObject(block);
			});
		};

		this.triggerSystems.push(system);
	}

	createRemovePit() {

		let system = new TriggerSystem();

		let showMural = new TriggerAction(1, () => {
			removePuzzleObject(pitCloseButton);
			addPuzzleObject(wallMural);
			system.setCompleted();
		});

		system.addTriggerAction(5, showMural);
		this.triggerSystems.push(system);
	}

	createFiveButtons() {

		let system = new TriggerSystem();

		let showButtonPuzzle = new TriggerAction(1, () => {

			fiveButtons.forEach(button => {
				addPuzzleObject(button);
			});
		});

		system.addTriggerAction(2, showButtonPuzzle);

		system.onCompleteAction = () => {

			removePuzzleObject(wallMural);

			floorBlocks[0].setAir(true);
			floorBlocks[1].setAir(true);
			floorBlocks[5].setAir(true);
			floorBlocks[7].setAir(true);
			floorBlocks[9].setAir(true);
			floorBlocks[11].setAir(true);
			floorBlocks[12].setAir(true);

			crackedBlocks.forEach(block => {
				addPuzzleObject(block);
			});

			blockade.setPos(5 * blockSize, 0, 4 * blockSize);
			addPuzzleObject(blockade);
			addPuzzleObject(parkourEndButton);

			lastCheckPoint = new Checkpoint(createVector(1.5 * blockSize, 0, 3.5 * blockSize), 270);
			lastCheckPoint.onResetLv = () => crackedBlocks.forEach(block => block.replace());
		};

		this.triggerSystems.push(system);
	};
}