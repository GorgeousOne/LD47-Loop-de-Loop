
class InteractionHandler {

	constructor() {
		this.interactables = [];
	}

	addInteractable(interactable) {
		this.interactables.push(interactable);
	}

	removeInteractable(interactable) {

		if(!interactable)
			throw 'could not remove undefined interactable';

		for (let i = 0; i < this.interactables.length; i++) {

			if (this.interactables[i] === interactable) {

				this.interactables.splice(i, 1);
				return;
			}
		}
	}

	checkHovering(ray) {
		this.interactables.forEach(interactable => interactable.isHovered = interactable.intersects(ray));
	}

	checkInteraction(ray) {
		this.interactables.forEach(interactable => {
			if (interactable.isHovered) {
				interactable.onInteract();
			}
		});
	}
}