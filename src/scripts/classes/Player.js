const DIRECTIONS = Object.freeze({BACKWARD: -1, NONE: 0, FORWARD: 1});
const TURNS = Object.freeze({LEFT: -1, NONE: 0, RIGHT: 1});
const SPEED = 10;

export default class Player {
    constructor(scene, map) {
        this.scene = scene;
        this.map = map;
        // получаем позицию из карты
        const position = this.map.getPlayerPosition();
        // помещаем спрайт машины в нужную позицию на сцене
        this.car = this.scene.matter.add.sprite(position.x, position.y, 'objects', 'car_blue_1');
        this.car.setFixedRotation(true); // отменяем самовольное вращение при столкновении
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
        return this.direction * SPEED;
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
    get angle() {
        return this.car.angle + this.turn * SPEED / 2;
    }
    getVelocityFromAngle() {
        const vec2 = new Phaser.Math.Vector2();
        return vec2.setToPolar(this.car.rotation - Math.PI/2, this.velocity);
    }
    move() {
        this.car.setAngle(this.angle);
        const velocity = this.getVelocityFromAngle();
        this.car.setVelocity(velocity.x, velocity.y);
    }
}