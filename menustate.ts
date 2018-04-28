/// <reference path='loadstate.ts' />
/// <reference path='playstate.ts' />
/// <reference path='constants.ts' />

class MenuState extends Phaser.State {
	sky: Phaser.TileSprite;
	keyInput: Phaser.Keyboard;
	keyEnter: Phaser.Key;
	keyBackspace: Phaser.Key;
	cursor: Phaser.BitmapData;
	cursorSprite: Phaser.Sprite;
	text: Phaser.Text;
	command: string;

	constructor() {
		super();
		this.command = '';
	}

	create() {
		// Add keyboard input
		this.keyInput = this.game.input.keyboard;
		this.keyInput.addCallbacks(this, 
			null, null, this.onPress);
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
		var textfield = this.game.add.sprite(ORIGIN_CURSOR_MENU_X - 20, 
			ORIGIN_CURSOR_MENU_Y - 16, 'text-field');
		// Add cursor
		this.cursor = this.game.add.bitmapData(16, 32, 'cursor');
		this.cursor.ctx.beginPath();
		this.cursor.ctx.fillStyle = '#fff';
		this.cursor.ctx.rect(0, 0, 16, 32);
		this.cursor.ctx.fill();
		this.cursorSprite = this.game.add.sprite(ORIGIN_CURSOR_MENU_X,
			ORIGIN_CURSOR_MENU_Y, this.cursor);
		// Add text
		this.text = this.game.add.text(ORIGIN_CURSOR_MENU_X, 
			ORIGIN_CURSOR_MENU_Y, this.command, {
			font: '32px Consolas', fill: '#fff'
		});
		// Add ok button
		this.game.add.button(416, 
			ORIGIN_CURSOR_MENU_Y - 16, 'ok-btn', this.onClick, 
			this, 1, 0, 2);
		// Add prompt
		this.game.add.text(ORIGIN_CURSOR_MENU_X + 12, 
			396, 'Click OK to start', { font: '50px Open Sans' });
		// Enable key uses
		this.keyEnter = this.keyInput.addKey(Phaser.KeyCode.ENTER);
		this.keyBackspace = this.keyInput.addKey(Phaser.KeyCode.BACKSPACE);
	}

	update() {
		// Read input from text field after user presses enter
		if (this.keyEnter.isDown) {
			// When "start" command executed
			if (this.command.indexOf('start') != -1) {
				this.onClick();
			}
			this.text.text = '';
			this.command = ''; // Clear command
			this.cursorSprite.x = ORIGIN_CURSOR_MENU_X; // Return cursor to origin
		}
		if (this.keyBackspace.isDown) {
			if (this.command.length > 0) {
				var buffer = this.command.substring(0, this.command.length - 1);
				this.command = buffer;
				this.text.text = '';
				this.drawChar(this.command, this.text, this.cursorSprite);
			}
		}
	}

	render() {}

	onPress(char) {
		if (this.command.length < 10) {
			this.command += char;
			this.drawChar(this.command, this.text, this.cursorSprite);
		}
	}

	onClick() {
		this.game.state.start('play', true);
	}

	drawChar(word: string, 
		text: Phaser.Text, 
		sprite: Phaser.Sprite) {
		var x = 0; // x position of cursor
		text.fill = '#fff'; // turn character to white
		// Draw every character and display on-screen
		var character = word.charAt(word.length - 1);
		text.text = text.text.concat(character);
		x = text.width;
		// Move cursor sprite
		sprite.x = ORIGIN_CURSOR_MENU_X + x;
	}
}