new p5();

let showHitboxes = false;

let physicsHandler;
let interactionHandler;
let triggerHandler;

let player;
let gameIsPaused = false;

let blockSize = 200;
let floorBlocks;
let innerWallBlocks;
let outerWallBlocks;
let triggerBlocks;

let pitBlocks;
let pitFloorBlock;

let puzzleStuff = [];
let lastCheckPoint;

let stepSounds;
let buttonSound;
let damageSound;
let correctSound;
let wrongSound;

let pitCloseButton;
let fiveButtons;
let buttonClickOrder;
let playerButtonClickOrder;

let mural;
let wallMural;

function preload() {

	stepSounds = [];
	stepSounds.push(loadSound('assets/step1.mp3'));
	stepSounds.push(loadSound('assets/step2.mp3'));
	stepSounds.push(loadSound('assets/step3.mp3'));
	stepSounds.push(loadSound('assets/step4.mp3'));
	stepSounds.push(loadSound('assets/step5.mp3'));

	buttonSound = loadSound('assets/button2.mp3');

	correctSound = loadSound('assets/correct.mp3');
	wrongSound = loadSound('assets/wrong.mp3');

	damageSound = loadSound('assets/damage2.mp3');
	mural = loadImage('assets/days-passed2.png');
}

function setup() {

	createCanvas(windowWidth, windowHeight, WEBGL);
	fullscreen();

	physicsHandler = new PhysicsHandler();
	interactionHandler = new InteractionHandler();

	player = new Player(3.2 * blockSize, 0, 1.2 * blockSize, 45);
	physicsHandler.addCollidable(player);

	floorBlocks = createRing(blockSize, 10*blockSize, 5, 1, -10, true);
	innerWallBlocks = createRing(blockSize, 11*blockSize, 3, 2, -10, true);
	outerWallBlocks = createRing(blockSize, 11*blockSize, 7, 0, -10, true);

	createTriggers(blockSize, 5);
	createPitBlocks();

	triggerHandler = new TriggerSystemHandler(triggerBlocks);
	physicsHandler.collisionListeners.push(this);
	physicsHandler.collisionListeners.push(triggerHandler);

	createButtons();
	wallMural = new Drawable(mural, createVector(3*blockSize, 0, 2*blockSize-0.01), blockSize, blockSize, 0, false);

	smooth();
	noStroke();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	player.applyFOV();
}

function addPuzzleObject(object) {
	puzzleStuff.push(object);
	physicsHandler.addCollidable(object);
}

function removePuzzleObject(object) {

	if (puzzleStuff.includes(object)) {
		let i = puzzleStuff.indexOf(object);
		puzzleStuff.splice(i, 1);
		physicsHandler.removeCollidable(object);
	}
}

let accumulator = 0;
let frameInterval = 1000 / 60;

function draw() {

	if (!gameIsPaused) {

		requestPointerLock();
		background(145, 202, 255);

		accumulator += deltaTime;

		while (accumulator > frameInterval) {
			accumulator -= frameInterval;
			movePlayer();
			physicsHandler.applyPhysics();
		}

		interactionHandler.checkForHoveredElements(new Ray(player.eyeLoc(), player.facing(), 150));

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
	triggerBlocks.forEach(block => block.display());
	puzzleStuff.forEach(block => block.display());

	pitBlocks.forEach(block => block.display());
	pitFloorBlock.display();

	pitCloseButton.display();
	fiveButtons.forEach(button => button.display());
	wallMural.display();
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

function mousePressed() {
	interactionHandler.interactWithHoveredElements();
}

const acceleration = 0.7;
// const acceleration = 2;
const rotSpeed = 0.13;

function keyPressed() {

	if (keyCode === 27 || keyCode === 80) {

		if (gameIsPaused) {
			gameIsPaused = false;
		}else {
			pauseGame();
		}
	}
}

function pauseGame() {
	gameIsPaused = true;
	exitPointerLock();
}

const stepSoundInterval = 250;
let timeWalked = 0;

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
		timeWalked = stepSoundInterval;
		return;
	}

	timeWalked += deltaTime;

	if (motForwards !== 0 && motSidewards !== 0) {
		motForwards /= sqrt(2);
		motSidewards /= sqrt(2);
	}

	if (!player.isOnGround) {
		motForwards /= 5;
		motSidewards /= 5;
	}

	player.move(motForwards, motSidewards);
	makeWalkingSounds();
}

function makeWalkingSounds() {

	if (timeWalked >= stepSoundInterval) {
		timeWalked %= stepSoundInterval;

		if (player.isOnGround) {
			// stepSounds[Math.floor(Math.random() * stepSounds.length)].play();
		}
	}
}

function onCollision(c1, c2) {

	if (c2 === pitFloorBlock) {

		lastCheckPoint.tpPlayer();
		damageSound.play();
	}
}

function createRing(width, height, gridSize, gridOffsetXZ = 0, gridOffsetY = 0, isVisible = true) {

	let ring = [];

	for (let x = 0; x < gridSize; x++) {
		for (let z = 0; z < gridSize; z++) {

			if (x > 0 && x < gridSize-1 && z > 0 && z < gridSize-1) {
				continue;
			}

			let block = new Block(
				(gridOffsetXZ + x) * blockSize,
				gridOffsetY * blockSize,
				(gridOffsetXZ + z) * blockSize,
				width, height, width);

			block.isVisible = isVisible;
			ring.push(block);
			physicsHandler.addCollidable(block);
		}
	}

	return ring;
}

function createTriggers(size) {

	triggerBlocks = [];
	triggerBlocks.push(new Block(size*2, 0, size, size, size, size));
	triggerBlocks.push(new Block(size*4, 0, size, size, size, size));
	triggerBlocks.push(new Block(size*5, 0, size*2, size, size, size));
	triggerBlocks.push(new Block(size*5, 0, size*4, size, size, size));
	triggerBlocks.push(new Block(size*4, 0, size*5, size, size, size));
	triggerBlocks.push(new Block(size*2, 0, size*5, size, size, size));
	triggerBlocks.push(new Block(size, 0, size*4, size, size, size));
	triggerBlocks.push(new Block(size, 0, size*2, size, size, size));

	triggerBlocks.forEach(tracker => {
		tracker.hitbox.outline = color(255, 0, 0);
		tracker.setAir(true);
		physicsHandler.addCollidable(tracker);
	});
}

function createPitBlocks() {

	pitBlocks = [];
	pitBlocks.push(new Block(2*blockSize, -10*blockSize, blockSize, blockSize/2, 10*blockSize, blockSize));
	pitBlocks.push(new Block(4.5*blockSize, -10*blockSize, blockSize, blockSize/2, 10*blockSize, blockSize));

	pitBlocks.forEach(block => {
		physicsHandler.addCollidable(block);
	});

	pitFloorBlock = new Block(blockSize, -10.5*blockSize, blockSize, 5*blockSize, blockSize/2, 5*blockSize);
	physicsHandler.addCollidable(pitFloorBlock);
}

function createButtons() {

	pitCloseButton = new Button(
		3.5 * blockSize, blockSize/3, blockSize,
		20, 10, createVector(0, 0, 1), false);

	pitCloseButton.onInteract = () => {
		buttonSound.play();
		pitCloseButton.isEnabled = false;
		triggerHandler.nextSystem();
	};

	interactionHandler.addInteractable(pitCloseButton);

	fiveButtons = [];
	buttonClickOrder = [3, 5, 4, 1, 2];
	playerButtonClickOrder = [];

	for (let i = 1; i < 6; ++i) {

		let button = new Button(
			2 * blockSize + i * blockSize/2,
			blockSize/3,
			6* blockSize,
			20, 10, createVector(0, 0, -1), false);

		button.onInteract = () => {

			buttonSound.play();
			button.isEnabled = false;
			playerButtonClickOrder.push(i);

			if (playerButtonClickOrder.length !== buttonClickOrder.length) {
				return;
			}

			if (!playerClickedCorrectly()) {
				wrongSound.play();
				floorBlocks[4].setAir(true);
				floorBlocks[6].setAir(true);
				floorBlocks[8].setAir(true);
				floorBlocks[10].setAir(true);
				floorBlocks[15].setAir(true);

				lastCheckPoint = new Checkpoint(createVector(3.5*blockSize, 0, 1.2*blockSize), 70);
				lastCheckPoint.onResetLvl = () => {

					floorBlocks[4].setAir(false);
					floorBlocks[6].setAir(false);
					floorBlocks[8].setAir(false);
					floorBlocks[10].setAir(false);
					floorBlocks[15].setAir(false);

					fiveButtons.forEach(button => button.isEnabled = true);
				}

			}else {
				correctSound.play();
			}
		};

		fiveButtons.push(button);
		interactionHandler.addInteractable(button);
	}

	function playerClickedCorrectly() {

		for (let i = 0; i < buttonClickOrder.length; ++i) {
			if (playerButtonClickOrder[i] !== buttonClickOrder[i]) {
				return false;
			}
		}
		return true;
	}
}