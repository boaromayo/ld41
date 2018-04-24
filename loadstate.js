/// <reference path='menustate.ts' />
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
/* LoadState loads the resources for the game. */
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
