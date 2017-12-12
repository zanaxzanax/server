import {GameInterface} from './game';
import {PlayerItem, UserItem} from './player';
import {GameSingleItem} from '.';
import Socket = SocketIO.Socket;

export interface AppInterface {
    games: GameInterface[];
    singles: GameSingleItem[];
    users: UserItem[];
    io: Socket;
    start: (io: any) => AppInterface;
    getGames: () => GameInterface[];
    getGame: (uuid: string) => GameInterface | GameSingleItem;
    joinGame: (uuid: string, user: PlayerItem) => boolean;
    readyGame: (uuid: string, user: PlayerItem) => void;
    pivotGame: (data: any, user: PlayerItem) => void;
    leaveGamesByUser: (user: UserItem) => void;
    addGame: (options: any) => GameInterface | GameSingleItem;
    removeGame: (uuid: string, user: PlayerItem) => boolean;
    getUserByName: (name: string) => UserItem;
}
