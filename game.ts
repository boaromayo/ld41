/// <reference path='libs/phaser.d.ts' />
/// <reference path='splashstate.ts' />

class Game {
	
	game: Phaser.Game;

	constructor() {
		this.game = new Phaser.Game(640, 480, Phaser.CANVAS, 'ld41', { preload: this.preload, create: this.create });
	}

	preload() {
		this.game.state.add('splash', SplashState);
		this.game.state.add('load', LoadState);
		this.game.state.add('menu', MenuState);
		this.game.state.add('play', PlayState);
	}

	create() {
		this.game.state.start('splash');
	}

}

window.onload = () => { new Game(); }