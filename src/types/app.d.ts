import {GameInterface} from './game';
import {PlayerItem, UserItem} from './player';

export interface AppInterface {
    games: GameInterface[];
    users: PlayerItem[];
    io: any;
    start: (io: any) => AppInterface;
    getGames: () => GameInterface[];
    getGame: (uuid: string) => GameInterface;
    joinGame: (uuid: string, user: PlayerItem) => boolean;
    readyGame: (uuid: string, user: PlayerItem) => void;
    pivotGame: (data: any, user: PlayerItem) => void;
    leaveGamesByUser: (user: UserItem) => void;
    addGame: (options: any) => GameInterface;
    removeGame: (uuid: string, user: PlayerItem) => boolean;
    getUserByName: (name: string) => UserItem;
}
