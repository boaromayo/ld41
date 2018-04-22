/// <reference path='game.ts' />
/// <reference path='loadstate.ts' />
/// <reference path='player.ts' />

class PlayState extends Phaser.State {
	
	// Set up variables for PlayState
	player: Player;
	tilemap: Phaser.Tilemap;
	layer0: Phaser.TilemapLayer;
	layer1: Phaser.TilemapLayer;
	layer2: Phaser.TilemapLayer;

	keyInput: Phaser.Keyboard;
	
	constructor() {
		super();
	}

	create() {
		// Add in tilemap
		this.tilemap = this.game.add.tilemap('map', 32, 32, 320, 160);

		// Add in tileset
		this.tilemap.addTilesetImage('tileset');

		// Add layers
		this.layer0 = this.tilemap.createLayer(0, 32, 32);
		this.layer1 = this.tilemap.createLayer(1, 32, 32);
		this.layer2 = this.tilemap.createLayer(2, 32, 32);

		// Resize world for all layers
		this.layer0.resizeWorld();
		this.layer1.resizeWorld();
		this.layer2.resizeWorld();

		// Set collision tiles for map: 0 for blank, 
		// 7-9 for lava and seas
		this.tilemap.setCollision(0);
		this.tilemap.setCollisionBetween(7,9);

		// Add in player
		this.player = new Player(this.game,this.tilemap);

		// Focus camera on player
		this.game.camera.follow(this.player.getSprite());
	}

	update() {
		this.player.update();
	}
}