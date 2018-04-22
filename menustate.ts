/// <reference path='game.ts' />
/// <reference path='loadstate.ts' />
/// <reference path='playstate.ts' />

class MenuState extends Phaser.State {
	
	sky: Phaser.TileSprite;

	constructor() {
		super();
	}

	create() {
		// Add background
		this.sky = this.game.add.tileSprite(0, 0, 640, 960, 'sky');
		this.sky.tilePosition.y = 0;

		var grass = this.game.add.sprite(0, 400, 'grass');

		// Add title and make it transparent
		//var title = this.game.add.sprite(100, 200, 'title');
		//title.alpha = 0;

		//var titleTween = this.game.add.tween(title);

		// Include cursor
		//var cursorSprite = this.game.add.sprite(314, 300, 'cursor');
		//cursorSprite.animations.play('go');

		// Add ok button
		this.game.add.button(256, 368, 'ok-btn', this.onClick, 
			this, 1, 0, 2);

		// Add prompt
		this.game.add.sprite(128, 416, 'prompt');

		this.game.time.events.add(2000, this.update);
	}

	update() {
		while (this.sky.tilePosition.y > 400) {
			this.sky.tilePosition.y -= 1;
		}
	}

	onClick() {
		this.game.state.start('play');
	}
}