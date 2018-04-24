/// <reference path='playstate.ts' />
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
