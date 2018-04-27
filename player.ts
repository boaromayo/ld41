/// <reference path='entity.ts' />

class Player extends Entity {
	sprite: Phaser.Sprite;
	//tool: Tool;
	cursors: Phaser.CursorKeys;
	hp: number;
	gems: number;

	constructor(game: Phaser.Game,tilemap: Phaser.Tilemap) {
		super(game,tilemap,32,32);
		this.x = ORIGIN_PLAYER_X;
		this.y = ORIGIN_PLAYER_Y;
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.hp = 15;
	}

	create() {
		this.sprite = new Phaser.Sprite(this.game, this.x, this.y, 'player');
		this.sprite.anchor.setTo(0.5,0.5);
		// Add animations
		this.sprite.animations.add('down', [0,3], 10, true, true);
		this.sprite.animations.add('right', [4,7], 10, true, true);
		this.sprite.animations.add('left', [8,11], 10, true, true);
		this.sprite.animations.add('up', [12,15], 10, true, true);

		this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
		this.game.add.existing(this.sprite);
	}

	update() {
		if (this.cursors.left.isDown) {
			this.direction = Direction.LEFT;
			this.sprite.animations.play('left', 10, true);
			this.vx = -2;
		} else if (this.cursors.right.isDown) {
			this.direction = Direction.RIGHT;
			this.sprite.animations.play('right', 10, true);
			this.vx = 2;
		} else if (this.cursors.up.isDown) {
			this.direction = Direction.UP;
			this.sprite.animations.play('up', 10, true);
			this.vy = -2;
		} else if (this.cursors.down.isDown) {
			this.direction = Direction.DOWN;
			this.sprite.animations.play('down', 10, true);
			this.vy = 2;
		} else {
			if (this.direction === Direction.LEFT) {
				this.sprite.frame = 24;
			} else if (this.direction === Direction.RIGHT) {
				this.sprite.frame = 20;
			} else if (this.direction === Direction.UP) {
				this.sprite.frame = 28;
			} else if (this.direction === Direction.DOWN) {
				this.sprite.frame = 16;
			}
			this.vx = this.vy = 0;
		}

		this.sprite.x += this.vx;
		this.sprite.y += this.vy;
	}

	heal() { this.hp++; }

	hurt() { 
		if (this.hp > 0) {
			this.hp--;
		}
	}

	health() { return this.hp; }
}