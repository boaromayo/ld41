/// <reference path='game.ts' />
/// <reference path='menustate.ts' />

/* LoadState loads the resources for the game. */
class LoadState extends Phaser.State {

	constructor() {
		super();
	}

	preload() {
		// Load menu assets.
		this.game.load.image('sky', 'assets/sky-background.png');
		this.game.load.image('grass', 'assets/grass-foreground.png');
		//this.game.load.image('title', 'assets/title.png');
		this.game.load.spritesheet('ok-btn', 'assets/ok-button.png', 128, 64);
		//this.game.load.image('cursor', 'assets/entry-cursor.png');
		this.game.load.image('prompt', 'assets/prompt.png');

		// Load game assets.
		this.game.load.tilemap('map', 'assets/field.csv', 
			null, Phaser.Tilemap.CSV);
		this.game.load.image('tileset', 'assets/tileset.png');
		this.game.load.spritesheet('itemset', 
			'assets/itemset.png', 32, 32);
		this.game.load.spritesheet('player', 
			'assets/player.png', 32, 32, 4, 0, 0);

		// Load keyboard for input.
		this.game.input.keyboard.enabled = true;
	}

	create() {
		// Add "Now Loading..."
		this.game.add.text(140, 200, 'Now loading...', { font: '48px Courier New', fill: '#ffffff' });

		// Wait two seconds and go to menu
		this.game.time.events.add(1500, () => 
			this.game.state.start('play'));
	}
}