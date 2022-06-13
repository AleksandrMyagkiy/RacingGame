import Phaser from "phaser";
import LoadingBar from "../classes/LoadingBar";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        this.add.sprite(0, 0, 'bg').setOrigin(0);
        this.LoadingBar = new LoadingBar(this);
        console.log('PreloadScene.preload');
    }

    create() {
        console.log('PreloadScene.create');
        this.scene.start('Game');

    }
}