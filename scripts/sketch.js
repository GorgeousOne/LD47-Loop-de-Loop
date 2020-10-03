new p5();

const startTime = Date.now();

let physicsHandler;
let player;
let wall1;
let wall2;

function preload() {

	// spriteHandler = new SpriteHandler();
	// spriteHandler.loadImage('font', 'scripts/dialog/pixel-font.min.png');
	//
	// spriteHandler.loadImage('buddy','assets/buddy.png');
	// spriteHandler.loadImage('fighter-buddy','assets/fighter-buddy.png');
	// spriteHandler.loadImage('child','assets/child.png');
	// spriteHandler.loadImage('child-sobbing','assets/child-sobbing.png');
	// spriteHandler.loadImage('child-side','assets/child-sidewards.png');
	// spriteHandler.loadImage('child-hugging','assets/child-hugging.png');
	//
	// spriteHandler.loadImage('path', 'assets/path.png');
	// spriteHandler.loadImage('forest', 'assets/forest-tiles.png');
	// spriteHandler.loadImage('house','assets/house.png');
	//
	// spriteHandler.loadImage('campfire','assets/campfire.png');
	// spriteHandler.loadImage('campfire-lit','assets/campfire-lit.png');
	// spriteHandler.loadImage('monster','assets/monster.png');
	//
	//
	// levels = [];
	// levels.push(loadStrings('levels/level1.txt'));
	// levels.push(loadStrings('levels/level2.txt'));
	// levels.push(loadStrings('levels/level3.txt'));
	// levels.push(loadStrings('levels/level4.txt'));
}

function setup() {

	createCanvas(windowWidth, windowHeight, WEBGL);
	fullscreen();
	smooth();

	physicsHandler = new PhysicsHandler();
	player = new Player();
	physicsHandler.addCollidable(player);

	wall1 = new Wall(-50, -150, -50, 100, 100, 100);
	wall2 = new Wall(-50, -150, 100, 100, 100, 100);

	physicsHandler.addCollidable(wall1);
	physicsHandler.addCollidable(wall2);
	//
	// player = new Player(spriteHandler.getImage('buddy'), 0.125);
	//
	// camera = new Camera();
	// camera.setTarget(player, true, true);
	// camera.zoom = Math.max(windowWidth, windowHeight) / 640;
	//
	// let forest = spriteHandler.getImage('forest');
	// stage = new Stage(100);
	// stage.addTex(TileType.PATH, spriteHandler.getImage('path'));
	// stage.addTex(TileType.FOREST_BACK_LEFT, forest.get(0, 0, 100, 100), new Hitbox(25, 25, 75, 75));
	// stage.addTex(TileType.FOREST_BACK_MID, forest.get(100, 0, 100, 100), new Hitbox(0, 25, 100, 75));
	// stage.addTex(TileType.FOREST_BACK_RIGHT, forest.get(200, 0, 100, 100), new Hitbox(0, 25, 75, 75));
	// stage.addTex(TileType.FOREST_LEFT, forest.get(0, 100, 100, 100), new Hitbox(25, 0, 75, 100));
	// stage.addTex(TileType.FOREST, forest.get(100, 100, 100, 100), new Hitbox(0, 0, 100, 100));
	// stage.addTex(TileType.FOREST_RIGHT, forest.get(200, 100, 100, 100), new Hitbox(0, 0, 75, 100));
	// stage.addTex(TileType.FOREST_FRONT_LEFT, forest.get(0, 200, 100, 100), new Hitbox(25, 0, 75, 75));
	// stage.addTex(TileType.FOREST_FRONT_MID, forest.get(100, 200, 100, 100), new Hitbox(0, 0, 100, 75));
	// stage.addTex(TileType.FOREST_FRONT_RIGHT, forest.get(200, 200, 100, 100), new Hitbox(0, 0, 75, 75));
	//
	// currentLevel = -1;
	//
	// mapLeaveBlock = new Collidable(-10, 375, 10, 250);
	// nextLevelTrigger = new Collidable(1000, 375, 10, 250);
	// nextLevelTrigger.onCollide = function(otherCollidable) {
	// 	if(otherCollidable === player)
	// 		changeLevel();
	// };
	//
	// physicsHandler.addCollidable(mapLeaveBlock);
	// physicsHandler.addCollidable(nextLevelTrigger);
	//
	// createNightImg();
	// changeLevel();
}

function draw() {

	requestPointerLock();
	background(205);

	movePlayer();
	physicsHandler.applyPhysics();

	player.focus();
	lights();

	push();
	stroke(255, 0, 0);
	line(0, 0, 0, 10, 0, 0);
	stroke(0, 255, 0);
	line(0, 0, 0, 0, 10, 0);
	stroke(0, 0, 255);
	line(0, 0, 0, 0, 0, 10);
	pop();

	wall1.display();
	wall2.display();
	// translate(0, -100, 0);
	// box(100);
	// translate(-100, 0, 0);
	// box(100);
	// translate(200, 0, 0);
	// box(100);
	// translate(-100, 0, -100);
	// box(100);
	// translate(0, 0, 200);
	// box(100);
}

const speed = 2.5;
const rotSpeed = 0.1;

function keyPressed() {

	if (keyCode === 32)
		player.jump(3);
}

function movePlayer() {

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

	if (motForwards !== 0 && motSidewards !== 0) {
		motForwards /= sqrt(2);
		motSidewards /= sqrt(2);
	}

	if (keyIsDown(32))
		player.jump(2);

	player.move(motForwards, motSidewards);
	player.rotate(-rotSpeed * movedX, -rotSpeed * movedY);
}

function signum(f) {
	if (f > 0) return 1;
	if (f < 0) return -1;
	return 0;
}
