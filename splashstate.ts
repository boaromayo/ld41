/// <reference path='loadstate.ts' />

class SplashState extends Phaser.State {

	constructor() {
		super();
	}

	preload() {
		this.game.load.image('logo', 'assets/boaromayo-splash.png');
	}

	create() {
		var logo = this.game.add.sprite(0, 0, 'logo');
		logo.alpha = 0; // Set to invisible.

		var fade = this.game.add.tween(logo);
		fade.to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 500, 0, true);
    fade.yoyoDelay(1000);

		this.game.time.events.add(6000, () => this.game.state.start('load'));
	}
}