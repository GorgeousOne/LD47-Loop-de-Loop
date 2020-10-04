
class InteractionHandler {

	constructor() {
		this.interactables = [];
	}

	addInteractable(element) {
		this.interactables.push(element);
	}

	removeInteractable(element) {

		if (this.interactables.includes(element)) {
			let i = this.interactables.indexOf(element);
			this.interactables.splice(i, 1);
		}
	}

	checkForHoveredElements(ray) {
		this.interactables.forEach(element => {
			element.isHovered = element.isVisible && element.isEnabled && element.intersects(ray);
		});
	}

	interactWithHoveredElements() {
		this.interactables.forEach(element => {
			if (element.isHovered) {
				element.fire();
			}
		});
	}
}