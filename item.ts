/// <reference path='entity.ts' />

abstract class Item extends Entity {
	sprite: Phaser.Sprite;
	abstract value: number;
	
	constructor(game: Phaser.Game,
		tilemap: Phaser.Tilemap,
		w: number,
		h: number) {
		super(game,tilemap,w,h);
	}

	abstract create();

	update() {}

	abstract effect();
}