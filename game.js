/// <reference path='libs/phaser.d.ts' />
/// <reference path='splashstate.ts' />
var ORIGIN_CURSOR_MENU_X = 116;
var ORIGIN_CURSOR_MENU_Y = 320;
var ORIGIN_CURSOR_PLAY_X = 208;
var ORIGIN_CURSOR_PLAY_Y = 410;
var ORIGIN_PLAYER_X = 832;
var ORIGIN_PLAYER_Y = 736;
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
        _this.x = ORIGIN_PLAYER_X;
        _this.y = ORIGIN_PLAYER_Y;
        _this.tempx = _this.x;
        _this.tempy = _this.y;
        _this.cursors = _this.game.input.keyboard.createCursorKeys();
        _this.maxhp = 15;
        _this.hp = _this.maxhp;
        return _this;
    }
    Player.prototype.create = function () {
        this.sprite = new Phaser.Sprite(this.game, this.x, this.y, 'player');
        this.sprite.anchor.setTo(0.5, 0.5);
        // Add animations
        this.sprite.animations.add('down', [0, 3], 10, true, true);
        this.sprite.animations.add('right', [4, 7], 10, true, true);
        this.sprite.animations.add('left', [8, 11], 10, true, true);
        this.sprite.animations.add('up', [12, 15], 10, true, true);
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.game.add.existing(this.sprite);
    };
    Player.prototype.update = function () {
        if (this.cursors.left.isDown) {
            this.direction = Direction.LEFT;
            this.sprite.animations.play('left', 10, true);
            this.setVelocity(-2, 0);
        }
        else if (this.cursors.right.isDown) {
            this.direction = Direction.RIGHT;
            this.sprite.animations.play('right', 10, true);
            this.setVelocity(2, 0);
        }
        else if (this.cursors.up.isDown) {
            this.direction = Direction.UP;
            this.sprite.animations.play('up', 10, true);
            this.setVelocity(0, -2);
        }
        else if (this.cursors.down.isDown) {
            this.direction = Direction.DOWN;
            this.sprite.animations.play('down', 10, true);
            this.setVelocity(0, 2);
        }
        else {
            this.stop();
        }
        this.tempx = this.vx;
        this.tempy = this.vy;
        this.move();
    };
    Player.prototype.move = function () {
        this.sprite.x += this.tempx;
        this.sprite.y += this.tempy;
    };
    Player.prototype.stop = function () {
        this.sprite.animations.stop();
        this.setVelocity(0, 0);
        this.tempx = this.sprite.x;
        this.tempy = this.sprite.y;
    };
    Player.prototype.heal = function () {
        if (this.hp < this.maxhp) {
            this.hp++;
        }
    };
    Player.prototype.healX = function (hp) {
        this.setHealth(this.hp + hp);
    };
    Player.prototype.hurt = function () {
        if (this.hp > 0) {
            this.hp--;
        }
    };
    Player.prototype.hurtX = function (hp) {
        this.setHealth(this.hp - hp);
    };
    Player.prototype.setHealth = function (hp) {
        // Gradually increment hp by one
        // rather than setting it immediately
        // update method will change hp per frame
        var inc = 0;
        if (hp < 0) {
            hp = 0;
        }
        else if (hp > this.maxhp) {
            hp = this.maxhp;
        }
        if (hp != this.hp) {
            if (hp > this.hp) {
                inc = 1;
            }
            else if (hp < this.hp) {
                inc = -1;
            }
            hp += inc;
        }
    };
    Player.prototype.setVelocity = function (velx, vely) {
        this.vx = velx;
        this.vy = vely;
    };
    Player.prototype.health = function () { return this.hp; };
    Player.prototype.maxHealth = function () { return this.maxhp; };
    Player.prototype.status = function () { return this.hp + '\/' + this.maxhp; };
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
        // Add in tilemap
        this.tilemap = this.game.add.tilemap('map', 32, 32, 320, 160);
        // Add in tileset
        this.tilemap.addTilesetImage('tileset', 'tileset');
        // Add layers
        this.floor = this.tilemap.createLayer('floor', this.game.world.width, this.game.world.height);
        this.detail = this.tilemap.createLayer('detail');
        this.objectLayer = this.tilemap.createLayer('event');
        // Set collision tiles for map: 0 for blank, 
        // 7-9 for lava and seas, and have first layer as collision layer
        this.tilemap.setCollision([1, 8, 9, 10], true, this.floor);
        this.tilemap.setCollisionBetween(8, 10, true, this.floor);
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
        var textfield = this.game.add.sprite(ORIGIN_CURSOR_PLAY_X - 16, ORIGIN_CURSOR_PLAY_Y - 16, 'text-field');
        textfield.fixedToCamera = true;
        // Add cursor
        var cursor = this.game.add.bitmapData(16, 32, 'cursor');
        cursor.ctx.beginPath();
        cursor.ctx.fillStyle = '#ffffff';
        cursor.ctx.rect(0, 0, 16, 32);
        cursor.ctx.fill();
        var cursorspriteX = this.game.camera.x + ORIGIN_CURSOR_PLAY_X;
        var cursorspriteY = this.game.camera.y + ORIGIN_CURSOR_PLAY_Y + textfield.y + 24;
        this.cursorsprite = this.game.add.sprite(cursorspriteX, cursorspriteY, cursor);
        // Add text for command
        this.text = this.game.add.text(ORIGIN_CURSOR_PLAY_X, ORIGIN_CURSOR_PLAY_Y, this.command, {
            font: '32px Consolas', fill: '#fff'
        });
        this.text.fixedToCamera = true;
        // Add in health
        var health = this.game.add.sprite(8, 8, 'itemset');
        health.frame = 0;
        health.fixedToCamera = true;
        this.healthText = this.game.add.text(health.x + 32, health.y, this.player.status().toString(), { font: '24px Open Sans', fill: '#000' });
        this.healthText.fixedToCamera = true;
        // Enable enter and backspace
        this.keyEnter = this.keyInput.addKey(Phaser.KeyCode.ENTER);
        this.keyBackspace = this.keyInput.addKey(Phaser.KeyCode.BACKSPACE);
    };
    PlayState.prototype.update = function () {
        var _this = this;
        this.game.physics.arcade.collide(this.player, this.detail, function () {
            _this.player.stop();
        });
        this.moveCursor();
        if (this.keyEnter.isDown) {
            // When "quit" cmd executed or
            // player's health is at 0, go to main menu
            if (this.command.indexOf('quit') != -1 ||
                this.command.indexOf('exit') != -1 ||
                this.player.health() < 1) {
                this.onExit();
            }
            else if (this.command.indexOf('hurt') != -1) {
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
        this.healthText.text = this.player.status().toString();
    };
    PlayState.prototype.moveCursor = function () {
        var offset = 2;
        this.cursorsprite.x = this.game.camera.x + ORIGIN_CURSOR_PLAY_X +
            this.text.width - offset;
        this.cursorsprite.y = this.game.camera.y + ORIGIN_CURSOR_PLAY_Y - offset;
    };
    PlayState.prototype.onPress = function (char) {
        if (this.command.length < 10) {
            this.command += char;
            this.drawChar(this.command, this.text);
        }
    };
    PlayState.prototype.onExit = function () {
        this.game.state.start('menu', true);
    };
    PlayState.prototype.drawChar = function (word, text) {
        // Draw last character and display on-screen
        var character = word.charAt(word.length - 1);
        text.fill = '#fff';
        text.text = text.text.concat(character);
    };
    return PlayState;
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
        this.game.load.tilemap('map', 'assets/island.json', null, Phaser.Tilemap.TILED_JSON);
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
        // Wait one second and go to menu
        this.game.time.events.add(1000, function () {
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
        fade.to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 500, 0, true);
        fade.yoyoDelay(2000);
        this.game.time.events.add(7000, function () {
            return _this.game.state.start('load');
        });
    };
    return SplashState;
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
            font: '32px Consolas', fill: '#fff'
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
        var debug = true;
        if (debug) {
            this.game.state.start('load');
        }
        else {
            this.game.state.start('splash');
        }
    };
    return Game;
}());
window.onload = function () { new Game(); };
