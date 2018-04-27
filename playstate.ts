/// <reference path='game.ts' />
/// <reference path='loadstate.ts' />
/// <reference path='player.ts' />
/// <reference path='constants.ts' />

class PlayState extends Phaser.State {
	player: Player;
	tilemap: Phaser.Tilemap;
	floor: Phaser.TilemapLayer;
	detail: Phaser.TilemapLayer;
	objectLayer: Phaser.TilemapLayer;
	keyInput: Phaser.Keyboard;
	keyEnter: Phaser.Key;
	keyBackspace: Phaser.Key;
	cursorsprite: Phaser.Sprite;
	text: Phaser.Text;
	command: string;
	healthText: Phaser.Text;
	
	constructor() {
		super();
		this.command = '';
	}

	create() {
		// Enable key input for every letter key
		this.keyInput = this.game.input.keyboard;
		this.keyInput.addCallbacks(this, null, null, this.onPress);
		// Add in tilemap
		this.tilemap = this.game.add.tilemap('map', 32, 32, 320, 160);
		// Add in tileset
		this.tilemap.addTilesetImage('tileset');
		// Add layers
		this.floor = this.tilemap.createLayer('floor', this.game.world.width, this.game.world.height);
		this.detail = this.tilemap.createLayer('detail');
		this.objectLayer = this.tilemap.createLayer('event');
		// Set collision tiles for map: 0 for blank, 
		// 7-9 for lava and seas, and have first layer as collision layer
		this.tilemap.setCollision(0, true, this.floor);
		this.tilemap.setCollisionBetween(7, 9, true, this.floor);
		// Add objects
		//this.findObjectsByType('npc', this.tilemap, this.tilemap.layers[2]);
		// Resize world
		this.floor.resizeWorld();
		// Add in player
		this.player = new Player(this.game, this.tilemap);
		this.player.create();
		// Focus camera on player
		this.game.camera.follow(this.player.sprite);
		// Start physics
		this.game.physics.enable(this.player.sprite, Phaser.Physics.ARCADE);
        // Add collisions explicitly to game
        //this.game.add.existing(this.tilemap);
		// Add text field
		var textfield = this.game.add.sprite(ORIGIN_CURSOR_PLAY_X - 16, 
			ORIGIN_CURSOR_PLAY_Y - 16, 'text-field');
		textfield.fixedToCamera = true;
		// Add cursor
		var cursor = this.game.add.bitmapData(16, 32, 'cursor');
		cursor.ctx.beginPath();
		cursor.ctx.fillStyle = '#ffffff';
		cursor.ctx.rect(0, 0, 16, 32);
		cursor.ctx.fill();
		var cursorspriteX = this.game.camera.x + ORIGIN_CURSOR_PLAY_X;
		var cursorspriteY = this.game.camera.y + ORIGIN_CURSOR_PLAY_Y + textfield.y + 24;
		this.cursorsprite = this.game.add.sprite(
			cursorspriteX, cursorspriteY,
			cursor);
		// Add text for command
		this.text = this.game.add.text(ORIGIN_CURSOR_PLAY_X, 
			ORIGIN_CURSOR_PLAY_Y, this.command, { 
			font: '32px Courier New', fill: '#fff' 
		});
		this.text.fixedToCamera = true;
		// Add in health
		var health = this.game.add.sprite(8, 8, 'itemset');
		health.frame = 0;
		health.fixedToCamera = true;
		this.healthText = this.game.add.text(health.x + 32, health.y, 
			this.player.health().toString(), 
			{ font: '24px Open Sans', fill: '#000' });
		this.healthText.fixedToCamera = true;
		// Enable enter and backspace
		this.keyEnter = this.keyInput.addKey(Phaser.KeyCode.ENTER);
		this.keyBackspace = this.keyInput.addKey(Phaser.KeyCode.BACKSPACE);
	}

	update() {
		this.game.physics.arcade.collide(this.player, this.floor);
		this.moveCursor();
		if (this.keyEnter.isDown) {
			// When "quit" cmd executed
			if (this.command.indexOf('quit') != -1 ||
				this.command.indexOf('exit') != -1) {
				this.onExit();
			} else if (this.command.indexOf('hurt') != -1) {
				this.player.hurt();
			}
			this.text.text = '';
			this.command = '';
			this.cursorsprite.x = this.game.camera.x + ORIGIN_CURSOR_PLAY_X;
		}
		if (this.keyBackspace.isDown) {
			if (this.command.length > 0) {
				var buffer = this.command.substring(0, this.command.length - 1);
				this.command = buffer;
				this.text.text = '';
				this.drawChar(this.command, this.text);
			}
		}
		this.player.update();
		this.healthText.text = this.player.health().toString();
	}

	moveCursor() {
		var offset = 2;
		this.cursorsprite.x = this.game.camera.x + ORIGIN_CURSOR_PLAY_X + 
			this.text.width - offset;
		this.cursorsprite.y = this.game.camera.y + ORIGIN_CURSOR_PLAY_Y - offset;
	}

	onPress(char) {
		if (this.command.length < 10) {
			this.command += char;
			this.drawChar(this.command, this.text);
		}
	}

	onExit() {
		this.game.state.start('menu', true);
	}

	drawChar(word: string,
		text: Phaser.Text) {
		// Draw last character and display on-screen
		var character = word.charAt(word.length - 1);
		text.fill = '#fff';
		text.text = text.text.concat(character);
	}

	/*findObjectsByType(type: string, 
		map: Phaser.Tilemap, layer) {
		var result = [];
		this.tilemap.objects[layer].forEach((item) => {
			if (item.properties.type === type) {
				// Since Phaser reads map from top-left, and
				// Tiled maps from bottom-left, y needs to be
				// adjusted 
                // Objects are the same size as tiles
				// (32x32), so we need not worry about any
				// discrepancies based on position
				item.y -= map.tileHeight;
				result.push(item);
			}
		});
		return result;
	}*/
}