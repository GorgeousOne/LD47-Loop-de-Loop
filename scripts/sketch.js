new p5();

const startTime = Date.now();

let physicsHandler;
let player;

function preload() {
}

let bricks;
let bricks2;
let bricks3;

function setup() {

	createCanvas(windowWidth, windowHeight, WEBGL);
	fullscreen();
	smooth();

	physicsHandler = new PhysicsHandler();
	player = new Player();
	physicsHandler.addCollidable(player);

	bricks = [];

	for (let i = 0; i < 15; i++) {
		let brick = new Wall(-50, -250, 250 - i*100, 100, 200, 100);
		physicsHandler.addCollidable(brick);
		bricks.push(brick);
	}

	bricks2 = [];

	for (let i = 0; i < 15; i++) {
		let brick = new Wall(-250, -250, 250 - i*100, 100, 200, 100);
		physicsHandler.addCollidable(brick);
		bricks2.push(brick);
	}

	bricks3 = [];

	for (let i = 0; i < 5; i++) {
		let brick = new Wall(-150, -100, 250 - i*300, 100, 100, 100);
		physicsHandler.addCollidable(brick);
		bricks2.push(brick);
	}

	noStroke();
}

function draw() {

	requestPointerLock();
	background(205);

	movePlayer();
	physicsHandler.applyPhysics();

	player.focus();
	// lights();

	let bright = 180;
	let bright2 = 180;
	ambientLight(bright, bright, bright);

	directionalLight(
		bright2, bright2, bright2, player.dirX(), -3, player.dirZ());

	push();
	stroke(255, 0, 0);
	line(0, 0, 0, 10, 0, 0);
	stroke(0, 255, 0);
	line(0, 0, 0, 0, 10, 0);
	stroke(0, 0, 255);
	line(0, 0, 0, 0, 0, 10);
	pop();

	bricks.forEach(brick => brick.display());
	bricks2.forEach(brick => brick.display());
}

const speed = 0.5;

const rotSpeed = 0.1;

function keyPressed() {

	if (keyCode === 32)
		player.jump(5);
}

function movePlayer() {

	player.rotate(-rotSpeed * movedX, -rotSpeed * movedY);

	let motForwards = 0;
	let motSidewards = 0;

	if (keyIsDown(65))
		motSidewards -= speed;

	if (keyIsDown(68))
		motSidewards += speed;

	if (keyIsDown(87))
		motForwards += speed;

	if (keyIsDown(83))
		motForwards -= speed;

	if (motForwards === 0 && motSidewards === 0) {
		return;
	}

	if (motForwards !== 0 && motSidewards !== 0) {
		motForwards /= sqrt(2);
		motSidewards /= sqrt(2);
	}

	if (keyIsDown(32))
		player.jump(2);

	if (!player.isOnGround) {
		motForwards /= 5;
		motSidewards /= 5;
	}

	player.move(motForwards, motSidewards);
}

function signum(f) {
	if (f > 0) return 1;
	if (f < 0) return -1;
	return 0;
}
