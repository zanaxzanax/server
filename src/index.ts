import express from './express';
import app from './classes/app';
import socket from './socket';

process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || `3000`;

Promise.resolve()
    .then(() => express.start())
    .then((server) => socket.start(server))
    .then((io) => app.start(io))
    .then((app) => {
        console.log('Initialized');
    })
    .catch(console.error);
