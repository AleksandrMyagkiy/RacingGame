export default class Stats {
    constructor(scene, laps) {
        this.scene = scene;
        this.laps = laps;
        // текущий круг
        this.lap = 1;    
        // общее время прохождения всей трассы
        this.time = 0;
        // время затраченное на текущий проходимый круг
        this.timeLap = 0;
        // время лучшего круга
        this.timeBestLap = 0;
        // время затраченное на предыдущий круг
        this.timeLastLap = 0;
    }
    // гонка завершена
    get complete() {
        // если значение текущего круга больше чем общее количество кругов
        return this.lap > this.laps;
    }
    
    // завершение каждого круга
    onLapComplete() {
        ++this.lap;
        // если не установленно лучшее время и время круга меньше времени лучшего круга
        if (this.timeBestLap === 0 || this.timeLap < this.timeBestLap) {
            // тогда устанавливаем времени лучшего круга из переменной timeLap
            this.timeBestLap = this.timeLap;
        }
        // и устанавливаем следующему кругу значение из переменной timeLap = 0;
        this.timeLastLap = this.timeLap;
        this.timeLap = 0;
    }
    update(dt) {
        if (!this.complete) {
            const time = dt / 1000;
            this.time += time;
            this.timeLap += time;
        }
    }
}