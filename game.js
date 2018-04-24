/// <reference path='libs/phaser.d.ts' />
/// <reference path='splashstate.ts' />
var ORIGIN_CURSOR_MENU_X = 116;
var ORIGIN_CURSOR_MENU_Y = 320;
var ORIGIN_CURSOR_PLAY_X = 208;
var ORIGIN_CURSOR_PLAY_Y = 410;
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
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["LEFT"] = 1] = "LEFT";
    Direction[Direction["RIGHT"] = 2] = "RIGHT";
    Direction[Direction["DOWN"] = 3] = "DOWN";
})(Direction || (Direction = {}));
var Entity = /** @class */ (function () {
    function Entity(game, tilemap, w, h) {
        this.game = game;
        this.tilemap = tilemap;
        this.w = w;
        this.h = h;
        this.vx = 0;
        this.vy = 0;
        this.direction = Direction.DOWN;
    }
    Entity.prototype.create = function () { };
    Entity.prototype.getSprite = function () { return this.sprite; };
    return Entity;
}());
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(game, tilemap) {
        var _this = _super.call(this, game, tilemap, 32, 32) || this;
        _this.x = _this.game.world.centerX;
        _this.y = _this.game.world.centerY;
        _this.cursors = _this.game.input.keyboard.createCursorKeys();
        _this.hp = 15;
        return _this;
    }
    Player.prototype.create = function () {
        this.sprite = this.game.add.sprite(this.x, this.y, 'player', 0);
        this.sprite.frame = 0;
        this.sprite.anchor.setTo(0.5, 0.5);
        // Add animations
        this.sprite.animations.add('down', [0, 3], 10, true, true);
        this.sprite.animations.add('right', [4, 7], 10, true, true);
        this.sprite.animations.add('left', [8, 11], 10, true, true);
        this.sprite.animations.add('up', [12, 15], 10, true, true);
    };
    Player.prototype.update = function () {
        if (this.cursors.left.isDown) {
            this.direction = Direction.LEFT;
            this.sprite.animations.play('left', 10, true);
            this.vx = -2;
        }
        else if (this.cursors.right.isDown) {
            this.direction = Direction.RIGHT;
            this.sprite.animations.play('right', 10, true);
            this.vx = 2;
        }
        else if (this.cursors.up.isDown) {
            this.direction = Direction.UP;
            this.sprite.animations.play('up', 10, true);
            this.vy = -2;
        }
        else if (this.cursors.down.isDown) {
            this.direction = Direction.DOWN;
            this.sprite.animations.play('down', 10, true);
            this.vy = 2;
        }
        else {
            if (this.direction === Direction.LEFT) {
                this.sprite.frame = 24;
            }
            else if (this.direction === Direction.RIGHT) {
                this.sprite.frame = 20;
            }
            else if (this.direction === Direction.UP) {
                this.sprite.frame = 28;
            }
            else if (this.direction === Direction.DOWN) {
                this.sprite.frame = 16;
            }
            this.vx = this.vy = 0;
        }
        this.sprite.x += this.vx;
        this.sprite.y += this.vy;
    };
    Player.prototype.health = function () { return this.hp; };
    return Player;
}(Entity));
var PlayState = /** @class */ (function (_super) {
    __extends(PlayState, _super);
    function PlayState() {
        var _this = _super.call(this) || this;
        _this.command = '';
        return _this;
    }
    PlayState.prototype.create = function () {
        // Enable key input for every letter key
        this.keyInput = this.game.input.keyboard;
        this.keyInput.addCallbacks(this, null, null, this.onPress);
        // Start physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        // Add in tilemap
        var tilemap = this.game.add.tilemap('map', 32, 32, 320, 160);
        // Add in tileset
        tilemap.addTilesetImage('tileset');
        // Set collision tiles for map: 0 for blank, 
        // 7-9 for lava and seas
        tilemap.setCollision(0);
        tilemap.setCollisionBetween(7, 9);
        // Add layers
        this.layer0 = tilemap.createLayer(0, this.game.width, this.game.height);
        //var layer1 = this.tilemap.createLayer(1, this.game.width, this.game.height);
        // Resize world for all layers
        this.layer0.resizeWorld();
        //this.layer1.resizeWorld();
        // Add in player
        this.player = new Player(this.game, tilemap);
        this.player.create();
        this.game.physics.enable(this.player.getSprite());
        // Focus camera on player
        this.game.camera.follow(this.player.getSprite());
        // Add text field
        var textfield = this.game.add.sprite(ORIGIN_CURSOR_PLAY_X - 16, ORIGIN_CURSOR_PLAY_Y - 16, 'text-field');
        textfield.fixedToCamera = true;
        // Add cursor
        var cursor = this.game.add.bitmapData(16, 32, 'cursor');
        cursor.ctx.beginPath();
        cursor.ctx.fillStyle = '#ffffff';
        cursor.ctx.rect(0, 0, 16, 32);
        cursor.ctx.fill();
        this.cursorsprite = this.game.add.sprite(ORIGIN_CURSOR_PLAY_X, ORIGIN_CURSOR_PLAY_Y, cursor);
        this.cursorsprite.visible = false;
        // Add text for command
        this.text = this.game.add.text(ORIGIN_CURSOR_PLAY_X, ORIGIN_CURSOR_PLAY_Y, this.command, {
            font: '32px Courier New', fill: '#fff'
        });
        this.text.fixedToCamera = true;
        // Add in health
        var health = this.game.add.sprite(8, 8, 'itemset');
        health.frame = 0;
        health.fixedToCamera = true;
        var healthText = this.game.add.text(health.x + 32, health.y, this.player.health().toString(), { font: '24px Open Sans', fill: '#000' });
        healthText.fixedToCamera = true;
        // Enable enter and backspace
        this.keyEnter = this.keyInput.addKey(Phaser.KeyCode.ENTER);
        this.keyBackspace = this.keyInput.addKey(Phaser.KeyCode.BACKSPACE);
    };
    PlayState.prototype.update = function () {
        this.game.physics.arcade.collide(this.player.getSprite(), this.layer0);
        if (this.keyEnter.isDown) {
            if (this.command.indexOf('quit') != -1) {
                this.onExit();
            }
            this.text.text = '';
            this.command = '';
            this.cursorsprite.x = ORIGIN_CURSOR_PLAY_X;
        }
        if (this.keyBackspace.isDown) {
            if (this.command.length > 0) {
                var buffer = this.command.substring(0, this.command.length - 1);
                this.command = buffer;
                this.text.text = '';
                this.drawChar(this.command, this.text, this.cursorsprite);
            }
        }
        this.player.update();
    };
    PlayState.prototype.onPress = function (char) {
        if (this.command.length < 10) {
            this.command += char;
            this.drawChar(this.command, this.text, this.cursorsprite);
        }
    };
    PlayState.prototype.onExit = function () {
        this.game.state.start('menu', true);
    };
    PlayState.prototype.drawChar = function (word, text, sprite) {
        var x = 0; // x position of cursor
        // Draw every character and display on-screen
        var character = word.charAt(word.length - 1);
        text.fill = '#fff';
        text.text = text.text.concat(character);
        x = text.width;
        // Move cursor sprite
        sprite.x = ORIGIN_CURSOR_PLAY_X + x;
    };
    return PlayState;
}(Phaser.State));
var MenuState = /** @class */ (function (_super) {
    __extends(MenuState, _super);
    function MenuState() {
        var _this = _super.call(this) || this;
        _this.command = '';
        return _this;
    }
    MenuState.prototype.create = function () {
        // Add keyboard input
        this.keyInput = this.game.input.keyboard;
        this.keyInput.addCallbacks(this, null, null, this.onPress);
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
        var textfield = this.game.add.sprite(ORIGIN_CURSOR_MENU_X - 20, ORIGIN_CURSOR_MENU_Y - 16, 'text-field');
        // Add cursor
        this.cursor = this.game.add.bitmapData(16, 32, 'cursor');
        this.cursor.ctx.beginPath();
        this.cursor.ctx.fillStyle = '#fff';
        this.cursor.ctx.rect(0, 0, 16, 32);
        this.cursor.ctx.fill();
        this.cursorSprite = this.game.add.sprite(ORIGIN_CURSOR_MENU_X, ORIGIN_CURSOR_MENU_Y, this.cursor);
        // Add text
        this.text = this.game.add.text(ORIGIN_CURSOR_MENU_X, ORIGIN_CURSOR_MENU_Y, this.command, {
            font: '32px Courier New', fill: '#fff'
        });
        // Add ok button
        this.game.add.button(416, ORIGIN_CURSOR_MENU_Y - 16, 'ok-btn', this.onClick, this, 1, 0, 2);
        // Add prompt
        this.game.add.text(ORIGIN_CURSOR_MENU_X + 12, 396, 'Click OK to start', { font: '50px Open Sans' });
        // Enable key uses
        this.keyEnter = this.keyInput.addKey(Phaser.KeyCode.ENTER);
        this.keyBackspace = this.keyInput.addKey(Phaser.KeyCode.BACKSPACE);
    };
    MenuState.prototype.update = function () {
        // Read input from text field after user presses enter
        if (this.keyEnter.isDown) {
            // Get command 'start' from text field
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
    };
    MenuState.prototype.render = function () { };
    MenuState.prototype.onPress = function (char) {
        if (this.command.length < 10) {
            this.command += char;
            this.drawChar(this.command, this.text, this.cursorSprite);
        }
    };
    MenuState.prototype.onClick = function () {
        this.game.state.start('play', true);
    };
    MenuState.prototype.drawChar = function (word, text, sprite) {
        var x = 0; // x position of cursor
        text.fill = '#fff'; // turn character to white
        // Draw every character and display on-screen
        var character = word.charAt(word.length - 1);
        text.text = text.text.concat(character);
        x = text.width;
        // Move cursor sprite
        sprite.x = ORIGIN_CURSOR_MENU_X + x;
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
        this.game.load.spritesheet('player', 'assets/player.png', 32, 32, 20, 0, 0);
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
