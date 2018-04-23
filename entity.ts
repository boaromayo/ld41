/// <reference path='game.ts' />
/// <reference path='playstate.ts' />

class Entity {
	game: Phaser.Game;
	// position
	x: number;
	y: number;
	tempx: number;
	tempy: number;
	// size
	w: number;
	h: number;
	// direction
	direction: { LEFT, RIGHT, UP, DOWN };
	tilemap: Phaser.Tilemap;
	sprite: Phaser.Sprite;

	constructor(game: Phaser.Game,
		tilemap: Phaser.Tilemap,
		w: number,
		h: number) {
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