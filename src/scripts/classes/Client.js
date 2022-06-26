const HOST = 'http://localhost:3000';

import Phaser from 'phaser';
import io from 'socket.io-client';

export default class Client extends Phaser.Events.EventEmitter {
    constructor() {
        super();
    }

    init() {
        this.master = false;
        const socket = io(HOST);
        socket.on('connect', () => {
            console.log('client connected');
        });
        socket.on('disconnect', () => {
            console.log('client disconnected');
        });
        socket.on('gameStart', data => {
            if (data && data.master) {
                this.master = data.master;
            } 
            this.emit('game');
        });
    }
}