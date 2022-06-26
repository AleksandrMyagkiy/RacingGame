import Phaser from "phaser";
import Map from "../classes/Map";
import Player from "../classes/Player";
import Stats from "../classes/Stats";
import StatsPanel from "../classes/StatsPanel";
import StatsPopup from "../classes/StatsPopup";

const LAPS = 3;
const CARS = {
    BLUE: {
        sprite: 'car_blue_1',
        position: 'player'
    },
    RED: {
        sprite: 'car_red_1',
        position: 'enemy'
    }
};

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }
    init(data) {
        if (data.client) {
            this.client = data.client;
        }
        // this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors = this.input.keyboard.addKeys('W,S,A,D');
    }
    preload() {
        this.add.sprite(0, 0, 'bg').setOrigin(0);
    }
    getCarsConfig() {
        // конфиг первого игрока
        let config = {player: CARS.BLUE, enemy: CARS.RED};

        if (this.client && !this.client.master) {
            // конфиг второго игрока
            config = {player: CARS.RED, enemy: CARS.BLUE};
        }
        return config;
    }

    create() {
        // создание карты
        this.map = new Map(this);
        const car = this.getCarsConfig();

        // создание игрока
        this.player = new Player(this, this.map, car.player);

        if (this.client) {
            this.enemy = new Player(this, this.map, car.enemy);
            this.client.on('data', data => {
                this.enemy.car.setX(data.x);
                this.enemy.car.setY(data.y);
                this.enemy.car.setAngle(data.angle);
            });
        }

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
            this.statsPopup = new StatsPopup(this, this.stats);
        }
    }
    update(time, dt) {
        this.stats.update(dt)
        this.statsPanel.render();
        this.player.move();
        this.sync();
    }
    sync() {
        if (this.client) {
            this.client.send({
                x: this.player.car.x,
                y: this.player.car.y,
                angle: this.player.car.angle
            });
        }
    }
}