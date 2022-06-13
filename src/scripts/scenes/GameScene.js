import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.add.sprite(0, 0, 'bg').setOrigin(0);
        console.log('GameScene.preload');
    }

    create() {
        console.log('GameScene.create');
    }
}