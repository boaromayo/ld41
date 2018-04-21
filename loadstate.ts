/// <reference path='game.ts' />
/// <reference path='menustate.ts' />

class LoadState extends Phaser.State {
	
	keyInput: Phaser.Keyboard;

	constructor() {
		super();
		this.keyInput = new Phaser.Keyboard(this.game);
	}

	preload() {
		// Load menu assets.
		this.game.load.image('sky', 'assets/sky-background.png');
		this.game.load.image('grass', 'assets/grass-foreground.png');
		this.game.load.image('entry-box', 'assets/entry-box.png');
		this.game.load.image('ok-btn', 'assets/ok-button.png');
		this.game.load.image('prompt', 'assets/start.png');

		// Load game assets.
		this.game.load.image('player', 'assets/player.png');
	}

	create() {
		this.game.add.text(200, 200, 'Now loading...', { font: 'Courier New', size: 48 });

		this.game.time.events.add(3000, () => 
			this.game.state.start('menu'));
	}
}