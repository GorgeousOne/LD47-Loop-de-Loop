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
let crackedBlocks;
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

let secondParkourButton;

let muralImg;
let wallMural;
let cracksTex;

function preload() {

	stepSounds = [];
	stepSounds.push(loadSound('assets/sounds/step1.mp3'));
	stepSounds.push(loadSound('assets/sounds/step2.mp3'));
	stepSounds.push(loadSound('assets/sounds/step3.mp3'));
	stepSounds.push(loadSound('assets/sounds/step4.mp3'));
	stepSounds.push(loadSound('assets/sounds/step5.mp3'));

	damageSound = loadSound('assets/sounds/damage2.mp3');
	buttonSound = loadSound('assets/sounds/button2.mp3');
	correctSound = loadSound('assets/sounds/correct.mp3');
	wrongSound = loadSound('assets/sounds/wrong.mp3');

	muralImg = loadImage('assets/textures/days-passed2.png');
	cracksTex = loadImage('assets/textures/crackles.png');
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
	outerWallBlocks = createRing(blockSize, 11*blockSize, 7, 0, -10, false);

	createTriggers(blockSize, 5);
	createPitBlocks();
	createCrackedBlocks();

	triggerHandler = new TriggerSystemHandler(triggerBlocks);
	physicsHandler.collisionListeners.push(this);
	physicsHandler.collisionListeners.push(triggerHandler);

	createButtons();
	wallMural = new Drawable(muralImg, createVector(3*blockSize, 0, 2*blockSize-0.01), blockSize, blockSize, 0, false);

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

	let lightLv = (1 + player.pos.y / (11*blockSize));

	if (!gameIsPaused) {

		requestPointerLock();

		accumulator += deltaTime;

		while (accumulator > frameInterval) {
			accumulator -= frameInterval;
			movePlayer();
			physicsHandler.applyPhysics();
		}

		interactionHandler.checkForHoveredElements(new Ray(player.eyeLoc(), player.facing(), 150));
	}else {
		lightLv = 0.6;
	}

	background(lightLv*145, lightLv*202, lightLv*255);

	player.applyCam();
	showOrigin();

	//if player falls it becomes darker;
	let bright = Math.min(180, 180 * lightLv);

	ambientLight(bright, bright, bright);
	directionalLight(bright, bright, bright, player.dirX(), -3, player.dirZ());

	if (showHitboxes)
		player.display();

	floorBlocks.forEach(block => block.display());
	innerWallBlocks.forEach(block => block.display());
	outerWallBlocks.forEach(block => block.display());
	triggerBlocks.forEach(block => block.display());
	puzzleStuff.forEach(stuff => stuff.display());

	crackedBlocks.forEach(block => block.display());

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
		player.jump(6);

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
		motForwards /= Math.sqrt(2);
		motSidewards /= Math.sqrt(2);
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

const blockBreakInterval = 500;

function onCollision(c1, c2) {

	if (c1 === player) {

		if (c2 === pitFloorBlock) {

			lastCheckPoint.tpPlayer();
			damageSound.play();

		}else if (crackedBlocks.includes(c2) && c2.isSolid && !c2.isAboutToFall) {

			c2.isAboutToFall = true;
			setTimeout(() => c2.setFalling(), blockBreakInterval);
		}

	}else if (crackedBlocks.includes(c1) && c2 === pitFloorBlock) {
		c1.setAir(true);
		c1.isRigid = false;
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
		block.setAir(true);
	});

	pitFloorBlock = new Block(blockSize, -10.5*blockSize, blockSize, 5*blockSize, blockSize/2, 5*blockSize);
	physicsHandler.addCollidable(pitFloorBlock);
}

function createCrackedBlocks() {

	crackedBlocks = [];
	crackedBlocks.push(new Block(blockSize, -blockSize/2, 2.5 * blockSize, blockSize/2, blockSize/2, blockSize/2));
	crackedBlocks.push(new Block(blockSize, -blockSize/2, 2 * blockSize, blockSize/2, blockSize/2, blockSize/2));
	crackedBlocks.push(new Block(blockSize, -blockSize/2, 1.5 * blockSize, blockSize/2, blockSize/2, blockSize/2));
	crackedBlocks.push(new Block(blockSize, -blockSize/2, blockSize, blockSize/2, blockSize/2, blockSize/2));
	crackedBlocks.push(new Block(1.5 * blockSize, -blockSize/2, blockSize, blockSize/2, blockSize/2, blockSize/2));
	crackedBlocks.push(new Block(2 * blockSize, -blockSize/2, blockSize, blockSize/2, blockSize/2, blockSize/2));
	crackedBlocks.push(new Block(2.5 * blockSize, -blockSize/2, blockSize, blockSize/2, blockSize/2, blockSize/2));
	crackedBlocks.push(new Block(3 * blockSize, -blockSize/2, blockSize, blockSize/2, blockSize/2, blockSize/2));
	crackedBlocks.push(new Block(3 * blockSize, -blockSize/2, 1.5 * blockSize, blockSize/2, blockSize/2, blockSize/2));
	crackedBlocks.push(new Block(3.5 * blockSize, -blockSize/2, 1.5 * blockSize, blockSize/2, blockSize/2, blockSize/2));
	crackedBlocks.push(new Block(4 * blockSize, -blockSize/2, 1.5 * blockSize, blockSize/2, blockSize/2, blockSize/2));
	crackedBlocks.push(new Block(4.5 * blockSize, -blockSize/2, 1.5 * blockSize, blockSize/2, blockSize/2, blockSize/2));
	crackedBlocks.push(new Block(5 * blockSize, -blockSize/2, 1.5 * blockSize, blockSize/2, blockSize/2, blockSize/2));
	crackedBlocks.push(new Block(5.5 * blockSize, -blockSize/2, 1.5 * blockSize, blockSize/2, blockSize/2, blockSize/2));
	crackedBlocks.push(new Block(5.5 * blockSize, -blockSize/2, 2 * blockSize, blockSize/2, blockSize/2, blockSize/2));
	crackedBlocks.push(new Block(5.5 * blockSize, -blockSize/2, 2.5 * blockSize, blockSize/2, blockSize/2, blockSize/2));

	crackedBlocks.forEach(block => {
		block.texture = cracksTex;
		block.setAir(true);
		physicsHandler.addCollidable(block);
	});
}

function createButtons() {

	pitCloseButton = new Button(
		3.5 * blockSize, blockSize/3, blockSize,
		20, 10, createVector(0, 0, 1), false);

	pitCloseButton.onInteract = () => {
		buttonSound.play();
		pitCloseButton.isEnabled = false;
		triggerHandler.currentSystem.setCompleted();
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
				lastCheckPoint.onResetLv = () => {

					floorBlocks[4].setAir(false);
					floorBlocks[6].setAir(false);
					floorBlocks[8].setAir(false);
					floorBlocks[10].setAir(false);
					floorBlocks[15].setAir(false);

					fiveButtons.forEach(button => button.isEnabled = true);
					playerButtonClickOrder = [];
				}

			}else {
				correctSound.play();
				triggerHandler.currentSystem.setCompleted();
			}
		};

		fiveButtons.push(button);
		interactionHandler.addInteractable(button);

		// secondParkourButton = new Button()
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