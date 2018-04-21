/// <reference path='game.ts' />
/// <reference path='loadstate.ts' />
/// <reference path='playstate.ts' />

class MenuState extends Phaser.State {
	
	command: String;

	constructor() {
		super();
		this.command = '';
	}

	create() {
		this.game.add.sprite(0, 0, 'sky');
		this.game.add.sprite(0, 400, 'grass');
	}

	update() {
		this.branch();
	}

	branch() {
		if (this.command === 'start') {
			this.game.state.start('play');
		}
	}
}