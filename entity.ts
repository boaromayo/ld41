/// <reference path='game.ts' />
/// <reference path='playstate.ts' />

class Entity {
	
	// Initialize all global variables
	// game object
	game: Phaser.Game;

	// movement
	x: number;
	y: number;
	tempx: number;
	tempy: number;

	// size
	w: number;
	h: number;

	// direction
	direction: { LEFT, RIGHT, UP, DOWN };

	// map the entity is in
	tilemap: Phaser.Tilemap;

	// sprite
	sprite: Phaser.Sprite;

	constructor(game,tilemap,w,h) {
		this.game = game;
		this.tilemap = tilemap;
		this.w = w;
		this.h = h;
		this.tempx = 0;
		this.tempy = 0;
		this.direction = this.direction.DOWN;
	}

	create() {}

	getSprite() { return this.sprite; }
}