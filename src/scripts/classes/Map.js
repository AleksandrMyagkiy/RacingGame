const GRASS_FRICTION = 0.3;
const ROADS_FRICTION = {
    road: 1,
    ground: 0.5,
    sand: 0.4
}

export default class Map {
    constructor(scene) {
        this.scene = scene;
        this.init();
        this.create();
    }
    init() {
        this.tilemap = this.scene.make.tilemap({key: 'tilemap'});
        this.tileset = this.tilemap.addTilesetImage('tileset', 'tileset', 64, 64, 0, 1);
    }
    create() {
        this.createLayers();
        this.createCollision();
        this.createCheckpoints();
        this.createOils();
    }
    createLayers() {
        this.tilemap.createStaticLayer('grass', this.tileset);
        this.tilemap.createStaticLayer('road', this.tileset);
        this.tilemap.createStaticLayer('sand', this.tileset);
        this.tilemap.createStaticLayer('ground', this.tileset);
    }
    createCollision() {
        this.tilemap.findObject('collisions', collision => {
            const sprite = this.scene.matter.add.sprite(collision.x + collision.width / 2, collision.y - collision.height / 2, 'objects', collision.name);
            sprite.setStatic(true);
        });
    }
    // ищем в tilemap все пятна с oil и добавляем их на нашу карту
    createOils() {
        this.tilemap.findObject('oils', oil => {
            const sprite = this.scene.matter.add.sprite(oil.x + oil.width / 2, oil.y - oil.height / 2, 'objects', oil.name);
            sprite.setStatic(true);
            sprite.setSensor(true); // делаем пятно доступным для пересечения машино
        });
    }
    createCheckpoints() {
        this.checkpoints = [];
        this.tilemap.findObject('checkpoints', checkpoint => {
            let rectangle = new Phaser.Geom.Rectangle(checkpoint.x, checkpoint.y, checkpoint.width, checkpoint.height);
            rectangle.index = checkpoint.properties.find(property => property.name === 'value').value;
            this.checkpoints.push(rectangle);
        });
    }
    getPlayerPosition() {
        return this.tilemap.findObject('player', position => {
            return position.name === 'player'; // возвращаем позицию игрока
        });
    }

    // берем каждый слой и ищем tile на каждом из слоев дорог в заданых координатах
    // которые определяются позицией машины в самом мире с главной игровой камерой
    // если такой tile есть - то мы возвращаем трение слоя на котором был найден соответствующий tile
    getTileFriction(car) {
        for (let road in ROADS_FRICTION) {
            let tile = this.tilemap.getTileAtWorldXY(car.x, car.y, false, this.scene.cameras.main, road)
            if (tile) {
                return ROADS_FRICTION[road];
            }
        }
        // если же tile не был найден не на одном слое, мы возвращаем трение травы
        return GRASS_FRICTION;
    }
    getCheckpoint(car) {
        //  если машина пересекает область чекпоинта
        const checkpoint = this.checkpoints.find(checkpoint => checkpoint.contains(car.x, car.y));
        // тогда возвращаем индекс чекпоинта, а если не пересекает возвращаем false
        return checkpoint ? parseInt(checkpoint.index) : false;
    }
}