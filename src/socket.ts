import * as s from 'socket.io';
import app from './classes/app';
import * as jwt from 'jsonwebtoken';

export default {
    start: (server) => new Promise((resolve, reject) => {

        const io = s.listen(server);

        io.on('connection', (socket: any) => {

            const token = socket.handshake.query.token;
            console.log('a user connected', token);

            jwt.verify(token, 'secret', (err, decoded) => {

                const user = decoded;

                if (err) {

                    socket.error('auth');

                } else {
                    console.log(decoded); // bar

                    app.users.push(user);

                    socket.on('ready', (uuid) => {
                        console.log('READY', uuid)
                        app.readyGame(uuid, user);
                    });

                    socket.on('pivot', (data) => {
                        console.log('PIVOT', data)
                        app.pivotGame(data, user);
                    });

                    socket.on('join', (uuid) => {
                        console.log('join', uuid)
                        if (app.joinGame(uuid, user)) {
                            console.log('JOIN')
                            socket.join(uuid);
                        }
                    });

                    socket.on('disconnect', () => {
                        console.log('user disconnected');

                        app.users.splice(app.users.indexOf(user), 1);
                        app.leaveGamesByPlayerUUID(user.uuid);
                    });
                }
            });
        });

        resolve(io)
    })
};
