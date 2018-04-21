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
        this.game.add.sprite(0, 0, 'sky');
        this.game.add.sprite(0, 400, 'grass');
    };
    MenuState.prototype.update = function () {
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
        var _this = _super.call(this) || this;
        _this.keyInput = new Phaser.Keyboard(_this.game);
        return _this;
    }
    LoadState.prototype.preload = function () {
        // Load menu assets.
        /*this.game.load.image('sky', 'assets/sky-background.png');
        this.game.load.image('grass', 'assets/grass-foreground.png');
        this.game.load.image('entry-box', 'assets/entry-box.png');
        this.game.load.image('ok-btn', 'assets/ok-button.png');
        this.game.load.image('prompt', 'assets/start.png');
        // Load game assets.
        this.game.load.image('player', 'assets/player.png');*/
    };
    LoadState.prototype.create = function () {
        this.game.add.text(200, 200, 'Now loading...', { font: 'Courier New', size: 48 });
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
        fade.to({ alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, 500, 1, true);
        this.game.time.events.add(3500, function () { return _this.game.state.start('load'); });
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
