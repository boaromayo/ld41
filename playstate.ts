/// <reference path='game.ts' />
/// <reference path='loadstate.ts' />
/// <reference path='player.ts' />
/// <reference path='cursor.ts' />
/// <reference path='constants.ts' />

class PlayState extends Phaser.State {
	player: Player;
	tilemap: Phaser.Tilemap;
	objects: Array<any>;
	keyInput: Phaser.Keyboard;
	keyEnter: Phaser.Key;
	keyBackspace: Phaser.Key;
	cursor: Cursor;
	//cursorsprite: Phaser.Sprite;
	text: Phaser.BitmapText;
	command: string;
	healthText: Phaser.BitmapText;
	
	constructor() {
		super();
		this.command = '';
	}

	create() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		// Enable key input for every letter key
		this.keyInput = this.game.input.keyboard;
		this.keyInput.addCallbacks(this, null, null, this.onPress);
		// Add in tilemap
		this.tilemap = this.game.add.tilemap('map', 32, 32, 320, 160);
		// Add in tileset
		this.tilemap.addTilesetImage('tileset', 'tileset');
		// Add layers
		var collision = this.tilemap.createLayer('floor', this.game.world.width, this.game.world.height);
		var detail = this.tilemap.createLayer('detail');
		// Initialize objects
		this.createObjects();
		// Set collision tiles for map: 0-1 for null and blank, 
		// 8-10 for lava and seas, and have first layer as collision layer
		this.tilemap.setCollision([0, 1, 8, 9, 10], true, collision, true);
		// Resize world
		collision.resizeWorld();
		detail.resizeWorld();
		// Add in player
		this.player = new Player(this.game, this.tilemap, collision);
		// Focus camera on player
		this.game.camera.follow(this.player.sprite);
		// Start physics
		this.game.physics.enable(this.player.sprite, Phaser.Physics.ARCADE);
		// Add text field
		var textfield = this.game.add.sprite(ORIGIN_CURSOR_PLAY_X - 16, 
			ORIGIN_CURSOR_PLAY_Y - 16, 'text-field');
		textfield.fixedToCamera = true;
		// Add cursor
		this.cursor = new Cursor(this.game, 16, 32);
		/*var cursor = this.game.add.bitmapData(16, 32, 'cursor');
		cursor.ctx.beginPath();
		cursor.ctx.fillStyle = '#ffffff';
		cursor.ctx.rect(0, 0, 16, 32);
		cursor.ctx.fill();
		var cursorspriteX = this.game.camera.x + ORIGIN_CURSOR_PLAY_X;
		var cursorspriteY = this.game.camera.y + ORIGIN_CURSOR_PLAY_Y + textfield.y + 24;
		this.cursorsprite = this.game.add.sprite(
			cursorspriteX, cursorspriteY,
			cursor);*/
		// Add text for command
		this.text = this.game.add.bitmapText(ORIGIN_CURSOR_PLAY_X, 
			ORIGIN_CURSOR_PLAY_Y, 'upheaval', this.command, 48);
		//this.text = this.game.add.bitmapText(ORIGIN_CURSOR_PLAY_X,
			//ORIGIN_CURSOR_PLAY_Y, 'retro', this.command, 48);
		this.text.fixedToCamera = true;
		// Add in health
		var health = this.game.add.sprite(8, 8, 'itemset');
		health.frame = 0;
		health.fixedToCamera = true;
		this.healthText = this.game.add.bitmapText(health.x + 36, health.y + 4, 
			'upheaval', this.player.status().toString(), 32);
		this.healthText.fixedToCamera = true;
		// Enable enter and backspace
		this.keyEnter = this.keyInput.addKey(Phaser.KeyCode.ENTER);
		this.keyBackspace = this.keyInput.addKey(Phaser.KeyCode.BACKSPACE);
	}

	createObjects(): Phaser.Group {
		var objects = this.game.add.group();
		objects.enableBody = true;
		// Get object based on type
		var home = this.findObjects(this.tilemap, 'home', 'event');
		var npc = this.findObjects(this.tilemap, 'npc', 'event');
		var sign = this.findObjects(this.tilemap, 'read', 'event');
		// For each type, load sprites per object
		home.forEach((item) => {
			this.makeSpritesForObjects(item, objects);
		}, this);
		npc.forEach((item) => {
			this.makeSpritesForObjects(item, objects);
		}, this);
		sign.forEach((item) => {
			this.makeSpritesForObjects(item, objects);
		}, this);
		return objects;
	}

	findObjects(map: Phaser.Tilemap, 
		type: string, layer: string): Array<any> {
		// Find each object based on type
		var items = new Array<any>();
		map.objects[layer].forEach((object) => {
			if (object.properties.type === type) {
				// Since Phaser uses top-left orientation, while Tiled uses
				// bottom-left orientation, y-position needs to be adjusted
				object.y -= map.tileHeight / 2;
				items.push(object);
			}
		});
		return items;
	}

	makeSpritesForObjects(object: any, 
		items: Phaser.Group) {
		// Create sprite based on item properties
		var sprite = items.create(object.x, 
			object.y, object.properties.name);
		// Copy all properties to sprite
		Object.keys(object.properties).forEach((key) => {
			sprite[key] = object.properties[key];
		});
	}

	update() {
		this.player.update();
		this.moveCursor();
		if (this.keyEnter.isDown) {
			// When "quit" cmd executed or
			// player's health is at 0, go to menu
			if (this.command.indexOf('quit') != -1 ||
				this.command.indexOf('exit') != -1 ||
				this.player.health() < 1) {
				this.onExit();
			} else if (this.command.indexOf('hurt') != -1) {
				this.player.hurt();
			}
			this.text.text = '';
			this.command = '';
			this.cursor.setCursor(this.game.camera.x + ORIGIN_CURSOR_PLAY_X, 
				this.cursor.position().y);
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
		this.healthText.text = this.player.status().toString();
	}

	moveCursor() {
		var offset = 2;
		var newX = this.game.camera.x + ORIGIN_CURSOR_PLAY_X + 
			this.text.width + offset;
		var newY = this.game.camera.y + ORIGIN_CURSOR_PLAY_Y;
		this.cursor.setCursor(newX,newY);
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
		text: Phaser.BitmapText) {
		// Draw last character and display on-screen
		var character = word.charAt(word.length - 1);
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