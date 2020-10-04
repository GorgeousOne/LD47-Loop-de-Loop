new p5();

let showHitboxes = false;

let physicsHandler;
let interactionHandler;
let walkingHandler;

let player;
let gameIsPaused = false;

let floorBlocks;
let innerWallBlocks;
let outerWallBlocks;
let trackerBlocks;

let blockSize = 200;

let rndPuzzleStuff = [];

function preload() {}

function setup() {

	createCanvas(windowWidth, windowHeight, WEBGL);
	fullscreen();

	physicsHandler = new PhysicsHandler();
	interactionHandler = new InteractionHandler();

	player = new Player(1.2 * blockSize, 0, 1.2 * blockSize, 45);
	physicsHandler.addCollidable(player);

	floorBlocks = createRing(blockSize, 5, 1, -1, true);
	innerWallBlocks = createRing(blockSize, 3, 2, 0, true);
	outerWallBlocks = createRing(blockSize, 7, 0, 0, true);

	trackerBlocks = createTrackers(blockSize, 5);
	walkingHandler = new WalkingHandler(trackerBlocks);
	physicsHandler.collisionListeners.push(walkingHandler);

	smooth();
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
	showOrigin();

	let bright = 180;
	let bright2 = 180;
	ambientLight(bright, bright, bright);
	directionalLight(bright2, bright2, bright2, player.dirX(), -3, player.dirZ());

	if (showHitboxes)
		player.display();

	floorBlocks.forEach(block => block.display());
	innerWallBlocks.forEach(block => block.display());
	outerWallBlocks.forEach(block => block.display());
	trackerBlocks.forEach(block => block.display());
	rndPuzzleStuff.forEach(block => block.display());
}

function showOrigin() {
	push();
	stroke(255, 5, 5);
	strokeWeight(3);
	line(5, 5, 5, 20, 5, 5);
	stroke(5, 255, 5);
	line(5, 5, 5, 5, 20, 5);
	stroke(5, 5, 255);
	line(5, 5, 5, 5, 5, 20);
	pop();
}

// const acceleration = 0.7;
const acceleration = 2;
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
		player.jump(7);

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

	let triggers = [];
	--gridSize;

	triggers.push(new Block(size/2, 0, size/2, 2*size, size, 2*size));
	triggers.push(new Block(size/2 + gridSize*size, 0, size/2, 2*size, size, 2*size));
	triggers.push(new Block(size/2 + gridSize*size, 0, size/2 + gridSize*size, 2*size, size, 2*size));
	triggers.push(new Block(size/2, 0, size/2 + gridSize*size, 2*size, size, 2*size));

	triggers.forEach(tracker => {
		tracker.hitbox.outline = color(255, 0, 0);
		tracker.isVisible = false;
		tracker.isSolid = false;
		physicsHandler.addCollidable(tracker);
	});

	return triggers;
}