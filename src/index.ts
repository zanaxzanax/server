import express from './express';
import app from './classes/app';
import socket from './socket';
import Socket = SocketIO.Socket;

process.env.NODE_ENV = 'production';

Promise.resolve()
    .then(() => express.start())
    .then((server) => socket.start(server))
    .then((io: Socket) => app.start(io))
    .then(() => console.log('Initialized'))
    .catch(console.error);
