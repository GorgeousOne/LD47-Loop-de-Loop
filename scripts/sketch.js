new p5();

var showHitboxes = true;

let physicsHandler;
let interactionHandler;

let player;
let gameIsPaused = false;

function preload() {
}

let floorBlocks;
let innerWallBlocks;
let outerWallBlocks;

let button;

function setup() {

	createCanvas(windowWidth, windowHeight, WEBGL);
	fullscreen();
	smooth();

	physicsHandler = new PhysicsHandler();
	interactionHandler = new InteractionHandler();

	player = new Player(100, 0, 300, 0);
	physicsHandler.addCollidable(player);

	let blockSize = 200;
	floorBlocks = createRing(blockSize, 5, 1, -1, true);
	innerWallBlocks = createRing(blockSize, 3, 2, 0, false);
	outerWallBlocks = createRing(blockSize, 7, 0, 0, false);

	button = new Button(
		createVector(0, 50, 0),
		10, 5,
		createVector(0, 0, 1));

	interactionHandler.addInteractable(button);
	noStroke();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	player.applyFOV();
}

let accumulator = 0;
let frameTime = 1000 / 60;

function draw() {

	if (!gameIsPaused) {

		requestPointerLock();
		background(145, 202, 255);

		accumulator += deltaTime;

		while (accumulator > frameTime) {
			accumulator -= frameTime;
			movePlayer();
			physicsHandler.applyPhysics();
		}

		let dirRay = new Ray(player.eyeLoc(), player.facing(), 100);
		interactionHandler.checkHovering(dirRay);
	}else {
		background(205);
	}

	player.applyCam();

	let bright = 180;
	let bright2 = 180;
	ambientLight(bright, bright, bright);

	directionalLight(bright2, bright2, bright2, player.dirX(), -3, player.dirZ());
	// directionalLight(bright2, bright2, bright2, 0.5, -3, 1);

	push();
	stroke(255, 0, 0);
	line(0, 0, 0, 10, 0, 0);
	stroke(0, 255, 0);
	line(0, 0, 0, 0, 10, 0);
	stroke(0, 0, 255);
	line(0, 0, 0, 0, 0, 10);
	pop();

	player.display();
	floorBlocks.forEach(brick => brick.display());
	innerWallBlocks.forEach(brick => brick.display());
	outerWallBlocks.forEach(brick => brick.display());

	push();
	button.display(button.isHovered ? color(255, 80, 80) : color(255, 40, 40));
	pop();
}

const acceleration = 0.7;
const rotSpeed = 0.13;

function keyPressed() {

	if (keyCode === 27 || keyCode === 80) {
		gameIsPaused = !gameIsPaused;

		if (gameIsPaused) {
			exitPointerLock();
		}
	}
}

function movePlayer() {

	player.rotate(-rotSpeed * movedX, -rotSpeed * movedY);

	if (keyIsDown(32))
		player.jump(5);

	let motForwards = 0;
	let motSidewards = 0;

	if (keyIsDown(65))
		motSidewards -= acceleration;

	if (keyIsDown(68))
		motSidewards += acceleration;

	if (keyIsDown(87))
		motForwards += acceleration;

	if (keyIsDown(83))
		motForwards -= acceleration;

	if (motForwards === 0 && motSidewards === 0) {
		return;
	}

	if (motForwards !== 0 && motSidewards !== 0) {
		motForwards /= sqrt(2);
		motSidewards /= sqrt(2);
	}

	if (!player.isOnGround) {
		motForwards /= 5;
		motSidewards /= 5;
	}

	player.move(motForwards, motSidewards);
}

function createRing(size, gridSize, gridOffsetXZ = 0, gridOffsetY = 0, isVisible = true) {

	let ring = [];

	for (let x = 0; x < gridSize; x++) {
		for (let z = 0; z < gridSize; z++) {

			if (x > 0 && x < gridSize-1 && z > 0 && z < gridSize-1) {
				continue;
			}

			let block = new Block(
				(gridOffsetXZ + x) * size,
				gridOffsetY * size,
				(gridOffsetXZ + z) * size,
				size, size, size);

			block.isVisible = isVisible;
			ring.push(block);
			physicsHandler.addCollidable(block);
		}
	}

	return ring;
}

function createTrackers(size, gridSize) {

	let trackers = [];

	trackers.push(new Block(0, 0, 0, size, size, size));
	trackers.push(new Block(gridSize*size, 0, 0, size, size, size));
	trackers.push(new Block(gridSize*size, 0, gridSize*size, size, size, size));
	trackers.push(new Block(0, 0, gridSize*size, size, size, size));

	trackers.forEach(collider => {
		collider.hitbox.outline = color(255, 0, 0);
		collider.isVisible = false;
		collider.isSolid = false;
		physicsHandler.addCollidable(collider);
	});

	return trackers;
}