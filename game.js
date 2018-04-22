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
var PlayState = /** @class */ (function (_super) {
    __extends(PlayState, _super);
    function PlayState() {
        return _super.call(this) || this;
    }
    PlayState.prototype.create = function () {
        // Add in tilemap
        this.tilemap = this.game.add.tilemap('map', 32, 32, 320, 160);
        // Add in tileset
        this.tilemap.addTilesetImage('tileset');
        // Add layers
        this.layer0 = this.tilemap.createLayer(0, 32, 32);
        this.layer1 = this.tilemap.createLayer(1, 32, 32);
        this.layer2 = this.tilemap.createLayer(2, 32, 32);
        // Resize world for all layers
        this.layer0.resizeWorld();
        this.layer1.resizeWorld();
        this.layer2.resizeWorld();
        // Set collision tiles for map: 0 for blank, 6 for sea
        this.tilemap.setCollision(0);
        this.tilemap.setCollision(6);
        // Add in player
        this.player = new Player(this.game, this.tilemap);
        // Focus camera on player
        this.game.camera.follow(this.player.getSprite());
    };
    PlayState.prototype.update = function () {
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
        // Add background
        var sky = this.game.add.tileSprite(0, 0, 640, 960, 'sky');
        //var grass = this.game.add.sprite(0, 400, 'grass');
        // Add title and make it transparent
        //var title = this.game.add.sprite(100, 200, 'title');
        //title.alpha = 0;
        //var titleTween = this.game.add.tween(title);
        // Add text box
        //this.game.add.sprite(290, 300, 'entry-box');
        // Include cursor
        //var cursorSprite = this.game.add.sprite(314, 300, 'cursor');
        //cursorSprite.animations.play('go');
        // Add ok button
        this.game.add.button(256, 336, 'ok-btn', this.onClick, this, 1, 0, 2);
        // Add prompt
        this.game.add.sprite(128, 416, 'prompt');
    };
    MenuState.prototype.update = function () {
        this.branch();
    };
    MenuState.prototype.onClick = function () {
        this.branch();
    };
    MenuState.prototype.branch = function () {
        if (this.command === 'start') {
            this.game.state.start('play');
        }
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
        //this.game.load.image('grass', 'assets/grass-foreground.png');
        //this.game.load.image('title', 'assets/title.png');
        //this.game.load.image('entry-box', 'assets/entry-box.png');
        this.game.load.spritesheet('ok-btn', 'assets/ok-button.png', 128, 64);
        //this.game.load.image('cursor', 'assets/entry-cursor.png');
        this.game.load.image('prompt', 'assets/prompt.png');
        // Load game assets.
        //this.game.load.tilemap('map', 'assets/field.csv', null, Phaser.Tilemap.CSV);
        //this.game.load.image('tileset', 'assets/tileset.png');
        //this.game.load.image('itemset', 'assets/itemset.png');
        //this.game.load.spritesheet('player', 'assets/player.png', 32, 32, 5, 0, 0);
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
        fade.to({ alpha: 1 }, 2500, Phaser.Easing.Linear.None, true, 1000, 0, true);
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
