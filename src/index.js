import Phaser from 'phaser';
import BootScene from './scripts/scenes/BootScene';
import PreloadScene from './scripts/scenes/PreloadScene';
import GameScene from './scripts/scenes/GameScene';


const config = {
    type: Phaser.AUTO,
    width: 1520,
    height: 720,
    scene: [BootScene, PreloadScene, GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'matter',
        matter: {
            debug: false,
            gravity: {x: 0, y: 0}
        }
    }
};

const game = new Phaser.Game(config);
