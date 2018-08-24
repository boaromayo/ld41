/// <reference path='entity.ts' />
/// <reference path='item.ts' />
/// <reference path='constants.ts' />

class Player extends Entity {
  sprite: Phaser.Sprite;
  items: Array<Item>;
  cursors: Phaser.CursorKeys;
  layer: Phaser.TilemapLayer;
  hp: number;
  maxhp: number;
  gems: number;
  maxItems: number;

  constructor(game: Phaser.Game,tilemap: Phaser.Tilemap,layer: Phaser.TilemapLayer) {
    super(game,tilemap,32,32);
    this.x = ORIGIN_PLAYER_X;
    this.y = ORIGIN_PLAYER_Y;
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.layer = layer;
    this.maxhp = MAX_DEFAULT_HEALTH;
    this.hp = this.maxhp;
    this.items = new Array<Item>();
    this.maxItems = 9;
    
    this.create();
  }

  create() {
    this.sprite = this.game.add.sprite(this.x, this.y, 'player');
    this.sprite.anchor.setTo(0.5,0.5);
    // Add animations
    this.sprite.animations.add('down', [0,3], 10, true, true);
    this.sprite.animations.add('right', [4,7], 10, true, true);
    this.sprite.animations.add('left', [8,11], 10, true, true);
    this.sprite.animations.add('up', [12,15], 10, true, true);
    // Enable collisions
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.game.physics.arcade.enableBody(this.sprite);
  }

  update() {
    var speed = 100;
    this.game.physics.arcade.collide(this.sprite, this.layer);
    this.sprite.body.velocity.set(0);

    if (this.cursors.left.isDown) {
      this.direction = Direction.LEFT;
      this.sprite.animations.play('left', 10, true);
      this.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.direction = Direction.RIGHT;
      this.sprite.animations.play('right', 10, true);
      this.setVelocityX(speed);
    } else if (this.cursors.up.isDown) {
      this.direction = Direction.UP;
      this.sprite.animations.play('up', 10, true);
      this.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.direction = Direction.DOWN;
      this.sprite.animations.play('down', 10, true);
      this.setVelocityY(speed);
    } else {
      this.stop();
    }
    this.x += this.sprite.body.velocity.x;
    this.y += this.sprite.body.velocity.y;
  }

  move() {
    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }

  stop() {
    this.sprite.animations.stop();
    this.setVelocityX(0);
    this.setVelocityY(0);
    this.x = this.sprite.x;
    this.y = this.sprite.y;
  }

  flash() {
    // TODO: Flash animation of player after damage.
  }

  heal() {
    if (this.isHurt()) { 
      this.hp++; 
    }
  }

  healX(hp: number) {
    if (this.isHurt()) {
      this.setHealth(this.hp+hp);
    }
  }

  hurt() { 
    if (!this.isDead()) {
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

  setVelocityX(velx: number) { 
    this.sprite.body.velocity.x = velx;
  }

  setVelocityY(vely: number) {
    this.sprite.body.velocity.y = vely;
  }

  health(): number { return this.hp; }

  maxHealth(): number { return this.maxhp; }

  status(): string { return this.hp + '\/' + this.maxhp; }

  isHurt(): boolean { return this.hp < this.maxhp; }

  isDead(): boolean { return this.hp <= 0; }

  isBagFull(): boolean { return this.items.length > this.maxItems; }

  addItem(item: Item) {
    if (this.isBagFull) {
      this.items.push(item);
    }
  }
}