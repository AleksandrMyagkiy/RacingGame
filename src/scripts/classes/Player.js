const DIRECTIONS = Object.freeze({BACKWARD: -1, NONE: 0, FORWARD: 1});
const TURNS = Object.freeze({LEFT: -1, NONE: 0, RIGHT: 1});
const SPEED = 10;
const ACCELERATION = 0.5;
const SLIDE_ANGLE = 5;
export default class Player {
    constructor(scene, map, config) {
        this.scene = scene;
        this.map = map;
        // получаем позицию из карты
        const position = this.map.getPlayerPosition(config.position);
        // помещаем спрайт машины в нужную позицию на сцене
        this.car = this.scene.matter.add.sprite(position.x, position.y, 'objects', config.sprite);
        this.car.setFixedRotation(true); // отменяем самовольное вращение при столкновении
        this._velocity = 0; // реальная скорость машины в данный момент времени
        this.checkpoint = 0;  // устанавливаем первоначальный чекпоинт
    }
    get direction() {
        let direction = DIRECTIONS.NONE;

        if (this.scene.cursors.W.isDown) {
            direction =  DIRECTIONS.FORWARD;
        } else if (this.scene.cursors.S.isDown) {
            direction = DIRECTIONS.BACKWARD;
        }

        return direction;
    }
    get velocity() {
        const speed = Math.abs(this._velocity); // получаем в speed текущую скорость без учета направления авто
        const max = this.getMaxSpeed();
        // если нажата кнопка движения вперед или назад и скорость меньше максимально допустимой с учетом трения поверхности на которой машина
        if (this.direction && speed < max) { 
            // тогда прибавляем к значение скорости 0,5 до тех пор пока работает условие
            this._velocity += ACCELERATION * Math.sign(this.direction); 
            // если газ нажат и максимальная скорость больше допустимой с учетом трения на данном слое
            // или если же кнопка движение не нажата и скорость больше 0
        } else if ((this.direction && speed) || (!this.direction && speed > 0)) { 
            // тогда уменьшаем скорость на 0,5 до полного остановления
            this._velocity -= ACCELERATION * Math.sign(this._velocity); 
        }
        return this._velocity;
    }
    get turn() {
        let turn = TURNS.NONE;

        if (this.scene.cursors.A.isDown) {
            turn =  TURNS.LEFT;
        } else if (this.scene.cursors.D.isDown) {
            turn = TURNS.RIGHT;
        }

        return turn;
    }

    // метод изменения угла машины при нажатии поворота влево или вправо
    get angle() {
        return this.car.angle + this.turn * SPEED / 3;
    }
    getVelocityFromAngle() {
        const vec2 = new Phaser.Math.Vector2();
        return vec2.setToPolar(this.car.rotation - Math.PI/2, this.velocity);
    }

    // проверка скорости с учетом трения поверхности на которой находится машина
    getMaxSpeed() {
        return SPEED * this.map.getTileFriction(this.car);
    }

    // добавляем метод изменения угла машины при наезде на oil
    slide() {
        this.car.angle += SLIDE_ANGLE;
    }
    move() {
        this.car.setAngle(this.angle);
        const velocity = this.getVelocityFromAngle();
        this.car.setVelocity(velocity.x, velocity.y);
        this.checkPosition();
    }
    checkPosition() {
        // передаем спрайт в метод getCheckpoint() и таким образом получаем checkpoint на котором сейчас находится машина
        const checkpoint = this.map.getCheckpoint(this.car);
        // если чекпоинт найден и на нем есть машина то выполним метод onCheckpoint()
        if (checkpoint) {
            this.onCheckpoint(checkpoint);
        }
    }
    onCheckpoint(checkpoint) {
        if (checkpoint === 1 && this.checkpoint === this.map.checkpoints.length) {
            // завершить круг
            this.checkpoint = 1;
            this.car.emit('lap');
            // каждый новый чекпоинт должен быть равен предыдущему + 1
        } else if (checkpoint === this.checkpoint + 1) {
            // в таком случаи увеличиваем предыдущий чекпоинт на 1
            ++this.checkpoint;
        }
    }

}