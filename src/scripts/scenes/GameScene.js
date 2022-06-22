import Phaser from "phaser";
import Map from "../classes/Map";
import Player from "../classes/Player";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }
    init() {
        // this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors = this.input.keyboard.addKeys('W,S,A,D');
    }
    preload() {
        this.add.sprite(0, 0, 'bg').setOrigin(0);
    }

    create() {
        // создание карты
        this.map = new Map(this);

        //создание игрока
        this.player = new Player(this, this.map);

        // устанавливаем граници камеры методом setBounds() // камера не будет выходить за заданный прямоугольник
        this.cameras.main.setBounds(0, 0, this.map.tilemap.widthInPixels, this.map.tilemap.heightInPixels);
        // позиционируем и вызываем камеру на машину игрока
        this.cameras.main.startFollow(this.player.car);
    }
    update() {
        this.player.move();
    }
}