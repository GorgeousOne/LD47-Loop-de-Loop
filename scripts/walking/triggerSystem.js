
class triggerSystem {

	constructor(startNextTaskOnFinish = false) {

		this.activeTriggers = [];
		this.triggerActions = new Map();
		this.triggersForCompletion = [];

		this.startNextTaskOnFinish = startNextTaskOnFinish;
		this.puzzleCompleted = false;
		this.onCompleteAction = undefined;
	}

	addTriggerAction(triggerIndex, action) {
		this.triggerActions.set(triggerIndex, action);
		print(this.triggerActions.has(triggerIndex) + " " + triggerIndex);
	}

	update(passedTriggers) {

		if (this.triggersForCompletion.length > 0) {
			this.checkTriggersToComplete(passedTriggers[0]);

			if (this.isCompleted()) {
				return;
			}
		}

		this.executeTrigger(passedTriggers[0], this.getWalkingDir(passedTriggers));
	}

	getWalkingDir(passedTriggers) {

		if (passedTriggers.length < 2) {
			return NaN;
		}

		let walkingDir = passedTriggers[0] - passedTriggers[1];

		if (Math.abs(walkingDir) > 1) {
			walkingDir = -Math.sign(walkingDir);
		}

		return walkingDir;
	}

	executeTrigger(triggerIndex, walkingDir) {

		if (!this.triggerActions.has(triggerIndex) || walkingDir === 0) {
			return;
		}

		let action = this.triggerActions.get(triggerIndex);

		if (isNaN(walkingDir) || action.walkingDir === walkingDir) {
			action.execute();
		}
	}


	checkTriggersToComplete(lastTriggerIndex) {

		if (this.triggersForCompletion.includes(lastTriggerIndex)) {

			let i = this.triggersForCompletion.indexOf(lastTriggerIndex);
			this.triggersForCompletion.splice(i, 1);
		}

		if (this.triggersForCompletion.length === 0) {
			this.setCompleted();
		}
	}

	setCompleted() {

		this.puzzleCompleted = true;

		if (this.onCompleteAction) {
			this.onCompleteAction();
		}
	}

	isCompleted() {
		return this.puzzleCompleted;
	}
}