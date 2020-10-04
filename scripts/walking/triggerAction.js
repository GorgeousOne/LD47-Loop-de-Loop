class TriggerAction {

	constructor(triggerDir, triggerAction) {
		this.walkingDir = triggerDir;
		this.triggerAction = triggerAction;
	}

	execute() {
		this.triggerAction();
	}
}