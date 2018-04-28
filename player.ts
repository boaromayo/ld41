/// <reference path='entity.ts' />

class Player extends Entity {
  sprite: Phaser.Sprite;
  tempx: number;
  tempy: number;
  //tool: Tool;
  cursors: Phaser.CursorKeys;
  hp: number;
  maxhp: number;
  gems: number;

  constructor(game: Phaser.Game,tilemap: Phaser.Tilemap) {
    super(game,tilemap,32,32);
    this.x = ORIGIN_PLAYER_X;
    this.y = ORIGIN_PLAYER_Y;
    this.tempx = this.x;
    this.tempy = this.y;
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.maxhp = 15;
    this.hp = this.maxhp;
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
      this.setVelocity(-2,0);
    } else if (this.cursors.right.isDown) {
      this.direction = Direction.RIGHT;
      this.sprite.animations.play('right', 10, true);
      this.setVelocity(2,0);
    } else if (this.cursors.up.isDown) {
      this.direction = Direction.UP;
      this.sprite.animations.play('up', 10, true);
      this.setVelocity(0,-2);
    } else if (this.cursors.down.isDown) {
      this.direction = Direction.DOWN;
      this.sprite.animations.play('down', 10, true);
      this.setVelocity(0,2);
    } else {
      this.stop();
    }
    this.tempx = this.vx;
    this.tempy = this.vy;
    this.move();
  }

  move() {
    this.sprite.x += this.tempx;
    this.sprite.y += this.tempy;
  }

  stop() {
    this.sprite.animations.stop();
    this.setVelocity(0,0);
    this.tempx = this.sprite.x;
    this.tempy = this.sprite.y;
  }

  heal() {
    if (this.hp < this.maxhp) { 
      this.hp++; 
    }
  }

  healX(hp: number) {
    this.setHealth(this.hp+hp);
  }

  hurt() { 
    if (this.hp > 0) {
      this.hp--;
    }
  }

  hurtX(hp: number) {
    this.setHealth(this.hp-hp);
  }

  setHealth(hp: number) {
    // Gradually increment hp by one
    // rather than setting it immediately
    // update method will change hp per frame
    var inc = 0;
    if (hp < 0) {
      hp = 0;
    } else if (hp > this.maxhp) {
      hp = this.maxhp;
    }
    if (hp != this.hp) {
      if (hp > this.hp) {
        inc = 1;
      } else if (hp < this.hp) {
        inc = -1;
      }
      hp += inc;
     }
  }

  setVelocity(velx: number, vely: number) { 
    this.vx = velx;
    this.vy = vely;
  }

  health(): number { return this.hp; }

  maxHealth(): number { return this.maxhp; }

  status(): string { return this.hp + '\/' + this.maxhp; }
}