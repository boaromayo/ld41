/// <reference path='playstate.ts' />

enum Direction { UP, LEFT, RIGHT, DOWN }

abstract class Entity {
	game: Phaser.Game;
	// position
	x: number;
	y: number;
	vx: number;
	vy: number;
	// size
	w: number;
	h: number;
	// other vars
	direction: Direction;
	tilemap: Phaser.Tilemap;
	abstract sprite: Phaser.Sprite;

	constructor(game: Phaser.Game,
		tilemap: Phaser.Tilemap,
		w: number,
		h: number) {
		this.game = game;
		this.tilemap = tilemap;
		this.w = w;
		this.h = h;
		this.vx = 0;
		this.vy = 0;
		this.direction = Direction.DOWN;
	}

	create() {}

	getSprite() { return this.sprite; }
}