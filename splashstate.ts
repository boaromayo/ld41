/// <reference path='game.ts' />
/// <reference path='menustate.ts' />

class SplashState extends Phaser.State {

	constructor(game) {
		super();
	}

	preload() {
		this.game.load.image('logo', 'assets/boaromayo-splash.png');
	}

	create() {
		var logo = this.game.add.sprite(0, 0, 'logo');
		logo.alpha = 0; // Set to invisible.

		var fade = this.game.add.tween(logo);
		fade.to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 500, 1, true);

		this.game.events.add(3000, () => this.game.state.start('load'));
	}
}