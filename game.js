/// <reference path='libs/phaser.d.ts' />
/// <reference path='splashstate.ts' />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Entity = /** @class */ (function () {
    function Entity(game, tilemap, w, h) {
        this.game = game;
        this.tilemap = tilemap;
        this.w = w;
        this.h = h;
        this.tempx = 0;
        this.tempy = 0;
        this.direction = this.direction.DOWN;
    }
    Entity.prototype.create = function () { };
    Entity.prototype.getSprite = function () { return this.sprite; };
    return Entity;
}());
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(game, tilemap) {
        var _this = _super.call(this, game, tilemap, 32, 32) || this;
        _this.x = 256;
        _this.y = 128;
        _this.cursors = _this.game.input.keyboard.createCursorKeys();
        _this.hp = 15;
        return _this;
    }
    Player.prototype.create = function () {
        this.sprite = this.game.add.sprite(0, 0, 'player', 1);
        this.sprite.body.setSize(32, 32);
        this.sprite.anchor.setTo(0.5, 0.5);
        // Add animations
        this.sprite.animations.add('down', [0, 3], 10, true, true);
        this.sprite.animations.add('right', [4, 7], 10, true, true);
        this.sprite.animations.add('left', [8, 11], 10, true, true);
        this.sprite.animations.add('up', [12, 15], 10, true, true);
        this.sprite.animations.add('idle-down', [16]);
        this.sprite.animations.add('idle-right', [20]);
        this.sprite.animations.add('idle-left', [24]);
        this.sprite.animations.add('idle-up', [28]);
    };
    Player.prototype.update = function () {
        if (this.cursors.left.isDown) {
            this.direction = this.direction.LEFT;
            this.sprite.animations.play('left', 15, true);
            this.tempx = this.tempx - 32;
        }
        else if (this.cursors.right.isDown) {
            this.direction = this.direction.RIGHT;
            this.sprite.animations.play('right', 15, true);
            this.tempx = this.tempx + 32;
        }
        else if (this.cursors.up.isDown) {
            this.direction = this.direction.UP;
            this.sprite.animations.play('up', 15, true);
            this.tempy = this.tempy - 32;
        }
        else if (this.cursors.down.isDown) {
            this.direction = this.direction.DOWN;
            this.sprite.animations.play('down', 15, true);
            this.tempy = this.tempy + 32;
        }
        else {
            if (this.direction === this.direction.LEFT) {
                this.sprite.animations.play('idle-left');
            }
            else if (this.direction === this.direction.RIGHT) {
                this.sprite.animations.play('idle-right');
            }
            else if (this.direction === this.direction.UP) {
                this.sprite.animations.play('idle-up');
            }
            else if (this.direction === this.direction.DOWN) {
                this.sprite.animations.play('idle-down');
            }
        }
    };
    Player.prototype.health = function () { return this.hp; };
    return Player;
}(Entity));
var PlayState = /** @class */ (function (_super) {
    __extends(PlayState, _super);
    function PlayState() {
        return _super.call(this) || this;
    }
    PlayState.prototype.create = function () {
        // Add in tilemap
        this.tilemap = this.game.add.tilemap('map', 32, 32, 320, 160);
        // Add in tileset
        this.tilemap.addTilesetImage('tileset', 'map');
        // Add layers
        this.layer0 = this.tilemap.createLayer(0, 32, 32);
        this.layer1 = this.tilemap.createLayer(1, 32, 32);
        // Resize world for all layers
        this.layer0.resizeWorld();
        this.layer1.resizeWorld();
        // Set collision tiles for map: 0 for blank, 
        // 7-9 for lava and seas
        this.tilemap.setCollision(0);
        this.tilemap.setCollisionBetween(7, 9);
        // Add in player
        this.player = new Player(this.game, this.tilemap);
        // Focus camera on player
        this.game.camera.follow(this.player.getSprite());
        // Add text field
        this.game.add.sprite(256, 368, 'text-field');
        // Add in health
        var health = this.game.add.sprite(8, 8, 'itemset');
        health.frame = 0;
    };
    PlayState.prototype.update = function () {
        this.player.update();
    };
    return PlayState;
}(Phaser.State));
var MenuState = /** @class */ (function (_super) {
    __extends(MenuState, _super);
    function MenuState() {
        var _this = _super.call(this) || this;
        _this.keyInput = _this.game.input.keyboard;
        return _this;
    }
    MenuState.prototype.create = function () {
        // Add keyboard input
        this.keyInput.addCallbacks(this, null, null, this.keyPress);
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
        this.cursor.fill(255, 255, 255, 1); // all white
        this.cursor.addToWorld();
        // Add ok button
        this.game.add.button(256, 368, 'ok-btn', this.onClick, this, 1, 0, 2);
        // Add prompt
        this.game.add.text(128, 416, 'Click OK to start', { font: '50px Open Sans' });
        // Enable key uses
        this.keyEnter = this.keyInput.addKey(Phaser.KeyCode.ENTER);
        this.keyBackspace = this.keyInput.addKey(Phaser.KeyCode.BACKSPACE);
    };
    MenuState.prototype.update = function () {
        // Update blinking cursor
        this.cursor.fill(255, 255, 255, 0);
        // Read input from text field after user presses enter
        if (this.keyEnter.isDown) {
            if (this.command === 'start') {
                this.onClick;
            }
            this.command = ''; // Clear command
        }
    };
    MenuState.prototype.render = function () { };
    MenuState.prototype.keyPress = function () {
        var x = 0; // x position of cursor
        for (var i = 0; i < this.command.length; i++) {
            // Draw every character and display on-screen
            var character = this.command.charAt(i);
            this.game.add.text(x * i, 400, character, { font: '24px Courier New', fill: '#fff' });
            x = x + 32;
        }
    };
    MenuState.prototype.onClick = function () {
        this.game.state.start('play');
    };
    return MenuState;
}(Phaser.State));
var LoadState = /** @class */ (function (_super) {
    __extends(LoadState, _super);
    function LoadState() {
        return _super.call(this) || this;
    }
    LoadState.prototype.preload = function () {
        // Load menu assets.
        this.game.load.image('sky', 'assets/sky-background.png');
        this.game.load.image('grass', 'assets/grass-foreground.png');
        //this.game.load.image('title', 'assets/title.png');
        this.game.load.spritesheet('ok-btn', 'assets/ok-button.png', 128, 64);
        this.game.load.image('text-field', 'assets/entry-box.png');
        // Load game assets.
        this.game.load.tilemap('map', 'assets/field.csv', null, Phaser.Tilemap.CSV);
        this.game.load.image('tileset', 'assets/tileset.png');
        this.game.load.spritesheet('itemset', 'assets/itemset.png', 32, 32);
        this.game.load.spritesheet('player', 'assets/player.png', 32, 32, 4, 0, 0);
        // Load keyboard for input.
        this.game.input.keyboard.enabled = true;
    };
    LoadState.prototype.create = function () {
        var _this = this;
        // Add "Now Loading..."
        this.game.add.text(140, 200, 'Now loading...', { font: '48px Courier New', fill: '#ffffff' });
        // Wait two seconds and go to menu
        this.game.time.events.add(1500, function () {
            return _this.game.state.start('menu');
        });
    };
    return LoadState;
}(Phaser.State));
var SplashState = /** @class */ (function (_super) {
    __extends(SplashState, _super);
    function SplashState() {
        return _super.call(this) || this;
    }
    SplashState.prototype.preload = function () {
        this.game.load.image('logo', 'assets/boaromayo-splash.png');
    };
    SplashState.prototype.create = function () {
        var _this = this;
        var logo = this.game.add.sprite(0, 0, 'logo');
        logo.alpha = 0; // Set to invisible.
        var fade = this.game.add.tween(logo);
        fade.to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 1000, 0, true);
        this.game.time.events.add(6000, function () { return _this.game.state.start('load'); });
    };
    return SplashState;
}(Phaser.State));
var Game = /** @class */ (function () {
    function Game() {
        this.game = new Phaser.Game(640, 480, Phaser.CANVAS, 'ld41', { preload: this.preload, create: this.create });
    }
    Game.prototype.preload = function () {
        this.game.state.add('splash', SplashState);
        this.game.state.add('load', LoadState);
        this.game.state.add('menu', MenuState);
        this.game.state.add('play', PlayState);
    };
    Game.prototype.create = function () {
        this.game.state.start('splash');
    };
    return Game;
}());
window.onload = function () { new Game(); };
