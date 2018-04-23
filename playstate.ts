/// <reference path='game.ts' />
/// <reference path='loadstate.ts' />
/// <reference path='player.ts' />

class PlayState extends Phaser.State {
	player: Player;
	tilemap: Phaser.Tilemap;
	layer0: Phaser.TilemapLayer;
	layer1: Phaser.TilemapLayer;
	keyInput: Phaser.Keyboard;
	
	constructor() {
		super();
	}

	create() {
		// Add in tilemap
		this.tilemap = this.game.add.tilemap('map', 32, 32, 320, 160);
		// Add in tileset
		this.tilemap.addTilesetImage('tileset', 'map');
		// Add layers
		this.layer0 = this.tilemap.createLayer(0, 32, 32);
		this.layer1 = this.tilemap.createLayer(1, 32, 32);
		// Resize world for all layers
		this.layer0.resizeWorld();
		this.layer1.resizeWorld();
		// Set collision tiles for map: 0 for blank, 
		// 7-9 for lava and seas
		this.tilemap.setCollision(0);
		this.tilemap.setCollisionBetween(7,9);
		// Add in player
		this.player = new Player(this.game,this.tilemap);
		// Focus camera on player
		this.game.camera.follow(this.player.getSprite());
		// Add text field
		this.game.add.sprite(256, 368, 'text-field');
		// Add in health
		var health = this.game.add.sprite(8, 8, 'itemset');
		health.frame = 0;

		
	}

	update() {
		this.player.update();
	}
}