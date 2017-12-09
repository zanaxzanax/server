import Game from './game';
import {AppInterface, GameInterface, PlayerInterface} from '../types';

class App implements AppInterface {

    games: GameInterface[] = [];
    users: PlayerInterface[] = [];
    io: any;

    start(io: any): AppInterface {
        this.io = io;
        return this;
    }

    getGames(): GameInterface[] {
        return this.games;
    }

    getGame(uuid: string): GameInterface {
        return this.games.find((game: GameInterface) => game.uuid === uuid) || null;
    }

    joinGame(uuid: string, user: PlayerInterface): boolean {
        const founded: GameInterface = this.getGame(uuid);
        if (founded && founded.join(user)) {
            this.io.emit('games:update', [founded]);
            return true;
        }
        return false;
    }

    readyGame(uuid: string, user: PlayerInterface): void {
        const founded: GameInterface = this.getGame(uuid);
        if (founded) {
            founded.ready(user);
        }
    }

    pivotGame(data: any, user: PlayerInterface): void {
        const founded: GameInterface = this.getGame(data.uuid);
        if (founded) {
            founded.pivot(data, user);
        }
    }

    leaveGamesByPlayerUUID(uuid: string): void {
        const games: GameInterface[] = this.games.filter((game: GameInterface) =>
            game.slots.find((player: PlayerInterface) => player.uuid === uuid));
        games.forEach((game: GameInterface) => {
            game.slots = game.slots.filter((player: PlayerInterface) => player.uuid !== uuid);
        });
        if (games.length) {
            this.io.emit('games:update', games);
        }
    }

    addGame(options: any): GameInterface {
        // TODO validate & return bool
        const game: GameInterface = new Game(this, options);
        this.games.push(game);
        this.io.emit('games:add', game);
        return game;
    }

    removeGame(uuid: string, user: PlayerInterface): boolean {
        const founded: GameInterface = this.getGame(uuid);
        if (founded && founded.creator.uuid === user.uuid) {
            founded.selfDestroy();
            this.games.splice(this.games.indexOf(founded), 1);
            this.io.emit('games:remove', [founded.uuid]);
            return true;
        } else {
            return false;
        }
    }

    getUserByName(name: string): PlayerInterface {
        return this.users.find((user: PlayerInterface) => user.name === name);
    }
}

export default new App();
