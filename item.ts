/// <reference path='entity.ts' />

class Item extends Entity {
	value: number;
	
	constructor(game: Phaser.Game,
		tilemap: Phaser.Tilemap,
		w: number,
		h: number) {
		super(game,tilemap,w,h);
	}

	update() {
		
	}
}