import * as s from 'socket.io';
import app from './classes/app';
import * as jwt from 'jsonwebtoken';
import {UserItem} from './types';
import Socket = SocketIO.Socket;

export default {
    start: (server) => new Promise((resolve, reject) => {

        const io = s.listen(server);

        io.on('error', (err) => {
            console.log('error', err)
        });

        io.on('connection', (socket: Socket) => {

            const token = socket.handshake.query.token;

            jwt.verify(token, 'secret', (err, decoded) => {

                const user: UserItem = decoded;

                if (err) {
                    socket.disconnect(true);
                } else {

                    // console.log(decoded);

                    user.socket = socket;

                    app.users.push(user);

                    socket.on('ready', (uuid: string) => {
                        app.readyGame(uuid, user);
                    });

                    socket.on('pivot', (data: any) => {
                        app.pivotGame(data, user);
                    });

                    socket.on('join', (uuid: string) => {
                        if (app.joinGame(uuid, user)) {
                            socket.join(uuid);
                        }
                    });

                    socket.on('disconnect', (reason) => {
                        app.users.splice(app.users.indexOf(user), 1);
                        app.leaveGamesByUser(user);
                    });
                }
            });
        });

        resolve(io)
    })
};
