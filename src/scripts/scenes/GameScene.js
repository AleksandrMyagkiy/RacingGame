import Phaser from "phaser";
import Map from "../classes/Map";
import Player from "../classes/Player";
import Stats from "../classes/Stats";
import StatsPanel from "../classes/StatsPanel";

const LAPS = 3;
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
        // создание игрока
        this.player = new Player(this, this.map);
        // создаем статистику
        this.stats = new Stats(this, LAPS);
        // выводим на екран статистику
        this.statsPanel = new StatsPanel(this, this.stats);

        // устанавливаем граници камеры методом setBounds() // камера не будет выходить за заданный прямоугольник
        this.cameras.main.setBounds(0, 0, this.map.tilemap.widthInPixels, this.map.tilemap.heightInPixels);
        // позиционируем и вызываем камеру на машину игрока
        this.cameras.main.startFollow(this.player.car);

        this.player.car.on('lap', this.onLapCmplete, this);
         //  устанавливаем событие collisionactive
        this.matter.world.on('collisionactive', (event, a, b) => {
            // если один из обьектов это машина игрока а второй - это пятно oil
            if (b.gameObject === this.player.car && a.gameObject.frame.name === 'oil') {
                // то вызываем метод заноса авто
                this.player.slide();
            }
        });
    }
    onLapCmplete(lap) {
        this.stats.onLapComplete();

        if (this.stats.complete) {
            this.scene.restart();
        }
    }
    update(time, dt) {
        this.stats.update(dt)
        this.statsPanel.render();
        this.player.move();
    }
}