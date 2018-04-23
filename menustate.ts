/// <reference path='game.ts' />
/// <reference path='loadstate.ts' />
/// <reference path='playstate.ts' />

class MenuState extends Phaser.State {	
	sky: Phaser.TileSprite;
	keyInput: Phaser.Keyboard;
	keyEnter: Phaser.Key;
	keyBackspace: Phaser.Key;
	cursor: Phaser.BitmapData;
	command: string;

	constructor() {
		super();
		this.keyInput = this.game.input.keyboard;
	}

	create() {
		// Add keyboard input
		this.keyInput.addCallbacks(this, 
			null, null, this.keyPress);
		// Add background
		var sky = this.game.add.tileSprite(0, 0, 640, 960, 'sky');
		sky.tilePosition.y = 0;
		// Add grass foreground
		var grass = this.game.add.sprite(0, 400, 'grass');
		// Add title and make it transparent
		//var title = this.game.add.sprite(100, 200, 'title');
		//title.alpha = 0;
		//var titleTween = this.game.add.tween(title);
		// Add text field
		this.game.add.sprite(256, 368, 'text-field');
		// Add cursor
		this.cursor = this.game.add.bitmapData(24, 32, 'cursor');
		this.cursor.fill(255,255,255,1); // all white
		this.cursor.addToWorld();
		// Add ok button
		this.game.add.button(256, 368, 'ok-btn', this.onClick, 
			this, 1, 0, 2);
		// Add prompt
		this.game.add.text(128, 416, 'Click OK to start', 
			{ font: '50px Open Sans' });
		// Enable key uses
		this.keyEnter = this.keyInput.addKey(Phaser.KeyCode.ENTER);
		this.keyBackspace = this.keyInput.addKey(Phaser.KeyCode.BACKSPACE);
	}

	update() {
		// Update blinking cursor
		this.cursor.fill(255,255,255,0);
		// Read input from text field after user presses enter
		if (this.keyEnter.isDown) {
			if (this.command === 'start') {
				this.onClick;
			}
			this.command = ''; // Clear command
		}
	}

	render() {}

	keyPress() {
		var x = 0; // x position of cursor
		for (let i = 0; i < this.command.length; i++) {
			// Draw every character and display on-screen
			var character = this.command.charAt(i);
			this.game.add.text(x*i, 400, character, 
				{ font: '24px Courier New', fill: '#fff' });
			x = x + 32;
		}
	}

	onClick() {
		this.game.state.start('play');
	}
}