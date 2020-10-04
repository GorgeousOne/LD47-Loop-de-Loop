
class Interactable {

	constructor() {
		this.faces = [];
	}

	display(color = color(255, 10, 0)) {

		fill(color);
		this.faces.forEach(face => face.display());
	}

	intersects(ray) {


		for(let face of this.faces){
			if (face.intersects(ray)) {
				return true;
			}
		};

		return false;
	}

	onInteract() {}
}