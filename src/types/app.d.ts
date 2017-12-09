import {GameInterface} from './game';
import {PlayerInterface} from './player';

export interface AppInterface {
    games: GameInterface[];
    users: PlayerInterface[];
    io: any;
    start: (io: any) => AppInterface;
    getGames: () => GameInterface[];
    getGame: (uuid: string) => GameInterface;
    joinGame: (uuid: string, user: PlayerInterface) => boolean;
    readyGame: (uuid: string, user: PlayerInterface) => void;
    pivotGame: (data: any, user: PlayerInterface) => void;
    leaveGamesByPlayerUUID: (uuid: string) => void;
    addGame: (options: any) => GameInterface;
    removeGame: (uuid: string, user: PlayerInterface) => boolean;
    getUserByName: (name: string) => PlayerInterface;
}
