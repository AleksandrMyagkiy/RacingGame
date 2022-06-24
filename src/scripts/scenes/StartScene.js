export default class StartScene extends Phaser.Scene {
    constructor() {
        super("Start");
    }
    create() {
        this.createBackground();
        this.createButtons();
        this.setEvents();
    }
    createBackground() {
        this.add.sprite(0, 0, 'bg').setOrigin(0);
    }
    createButtons() {
        this.button1 = this.add.text(this.cameras.main.centerX, 
            this.cameras.main.centerY - 50, 'ONE PLAYER',
            {font: 'bold 46px Arial', fill: '#FAFAD2'})
            .setOrigin(0.5)
            .setInteractive();

        this.button2 = this.add.text(this.cameras.main.centerX, 
            this.cameras.main.centerY + 50, 'TWO PLAYER',
            {font: 'bold 46px Arial', fill: '#FAFAD2'})
            .setOrigin(0.5)
            .setInteractive();
    }
    setEvents() {
        this.button1.on('pointerdown', this.startGame, this);
        this.button2.on('pointerdown', this.requestGame, this);
    }
    startGame() {
        this.scene.start('Game');
    }
    requestGame() {
        // инициализировать клиент
        // отправить запрос игры на сервер
        // по факту получения противника
        // начать игру
        this.startGame();
    }
}