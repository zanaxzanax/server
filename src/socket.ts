import * as s from 'socket.io';
import app from './classes/app';
import * as jwt from 'jsonwebtoken';
import {PlayerItem, PointItem, UserItem} from './types';
import Socket = SocketIO.Socket;

export default {
    start: (server) => new Promise((resolve, reject) => {

        const io = s.listen(server);

        io.on('connection', (socket: Socket) => {

            const token = socket.handshake.query.token;
            console.log('a user connected', token);

            jwt.verify(token, 'secret', (err, decoded) => {

                const user: UserItem = decoded;

                if (err) {

                    socket.disconnect(true);

                } else {
                    console.log(decoded); // bar

                    user.socket = socket;

                    app.users.push(user);

                    socket.on('ready', (uuid: string) => {
                        console.log('READY', uuid)
                        app.readyGame(uuid, user);
                    });

                    socket.on('pivot', (data: any) => {
                        console.log('PIVOT', data)
                        app.pivotGame(data, user);
                    });

                    socket.on('join', (uuid: string) => {
                        console.log('join', uuid)
                        if (app.joinGame(uuid, user)) {
                            console.log('JOIN TO ROOM')
                            socket.join(uuid);
                        }
                    });

                    socket.on('disconnect', (reason) => {
                        console.log('user disconnected ' + user.name, ' ', reason);

                        app.users.splice(app.users.indexOf(user), 1);
                        app.leaveGamesByUser(user);
                    });
                }
            });
        });

        resolve(io)
    })
};
