/// <reference path='entity.ts' />

class Player extends Entity {
	
	//tool: Tool;
	cursors: Phaser.CursorKeys;

	constructor(game,tilemap) {
		super(game,tilemap,32,32);
		this.x = 256;
		this.y = 128;
		this.cursors = this.game.input.keyboard.createCursorKeys();
	}

	create() {
		this.sprite = this.game.add.sprite(0, 0, 'player', 1);
		this.sprite.body.setSize(30,30);
		this.sprite.anchor.setTo(0.5,0.5);

		// Add animations
		this.sprite.animations.add('down', [0,3], 10, true, true);
		this.sprite.animations.add('right', [4,7], 10, true, true);
		this.sprite.animations.add('left', [8,11], 10, true, true);
		this.sprite.animations.add('up', [12,15], 10, true, true);
		this.sprite.animations.add('idle-down', [16]);
		this.sprite.animations.add('idle-right', [20]);
		this.sprite.animations.add('idle-left', [24]);
		this.sprite.animations.add('idle-up', [28]);
	}

	update() {
		if (this.cursors.left.isDown) {
			this.direction = this.direction.LEFT;
			this.sprite.animations.play('left', 15, true);
			this.tempx = this.tempx - 32;
		} else if (this.cursors.right.isDown) {
			this.direction = this.direction.RIGHT;
			this.sprite.animations.play('right', 15, true);
			this.tempx = this.tempx + 32;
		} else if (this.cursors.up.isDown) {
			this.direction = this.direction.UP;
			this.sprite.animations.play('up', 15, true);
			this.tempy = this.tempy - 32;
		} else if (this.cursors.down.isDown) {
			this.direction = this.direction.DOWN;
			this.sprite.animations.play('down', 15, true);
			this.tempy = this.tempy + 32;
		} else {
			if (this.direction === this.direction.LEFT) {
				this.sprite.animations.play('idle-left');
			} else if (this.direction === this.direction.RIGHT) {
				this.sprite.animations.play('idle-right');
			} else if (this.direction === this.direction.UP) {
				this.sprite.animations.play('idle-up');
			} else if (this.direction === this.direction.DOWN) {
				this.sprite.animations.play('idle-down');
			}
		}
	}
}