/// <reference path='game.ts' />
/// <reference path='loadstate.ts' />
/// <reference path='player.ts' />
/// <reference path='constants.ts' />
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
        // Add layers
        this.layer0 = tilemap.createLayer(0, this.game.width, this.game.height);
        //var layer1 = this.tilemap.createLayer(1, this.game.width, this.game.height);
        // Resize world for all layers
        this.layer0.resizeWorld();
        //this.layer1.resizeWorld();
        // Set collision tiles for map: 0 for blank, 
        // 7-9 for lava and seas
        tilemap.setCollision(0);
        tilemap.setCollisionBetween(7, 9);
        this.game.physics.arcade.enableBody(this.player);
        // Add in player
        this.player = new Player(this.game, tilemap);
        this.player.create();
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
        this.cursorsprite.fixedToCamera = true;
        // Add text for command
        this.text = this.game.add.text(ORIGIN_CURSOR_PLAY_X, ORIGIN_CURSOR_PLAY_Y, this.command, {
            font: '32px Courier New', fill: '#fff'
        });
        // Add in health
        var health = this.game.add.sprite(8, 8, 'itemset');
        health.frame = 0;
        health.fixedToCamera = true;
        this.game.add.text(health.x + 16, health.y, this.player.health().toString(), { font: '12px Open Sans', fill: '#000' });
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
