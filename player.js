/// <reference path='entity.ts' />
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
        // Add physics to player
        this.game.physics.enable(this.sprite);
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
