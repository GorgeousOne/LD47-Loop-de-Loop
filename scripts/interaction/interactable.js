
class Interactable {

	constructor(isEnabled = true, isVisible = true) {

		this.isEnabled = isEnabled;
		this.isVisible = isVisible;
		this.clickableFaces = [];
		this.onInteract = undefined;
	}

	display() {

		if (!this.isVisible) {
			return;
		}

		this.clickableFaces.forEach(face => face.display());
	}

	intersects(ray) {

		if (!this.isEnabled) {
			return;
		}

		for(let face of this.clickableFaces){
			if (face.intersects(ray)) {
				return true;
			}
		}

		return false;
	}

	fire() {
		if (this.onInteract) {
			this.onInteract();
		}
	}
}