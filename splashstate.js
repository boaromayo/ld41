/// <reference path='loadstate.ts' />
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
