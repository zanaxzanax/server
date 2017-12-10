import Game from './game';
import {AppInterface, GameInterface, PlayerInterface, PlayerItem, UserItem} from '../types';

class App implements AppInterface {

    games: GameInterface[] = [];
    users: UserItem[] = [];
    io: any;

    start(io: any): AppInterface {
        this.io = io;
        return this;
    }

    getGames(): GameInterface[] {
        return this.games || [];
    }

    getGame(uuid: string): GameInterface {
        return this.games.find((game: GameInterface) => game.uuid === uuid) || null;
    }

    joinGame(uuid: string, user: PlayerItem): boolean {
        const founded: GameInterface = this.getGame(uuid);
        if (founded && founded.join(user)) {
            this.io.emit('games:update', [founded]);
            return true;
        }
        return false;
    }

    readyGame(uuid: string, user: PlayerItem): void {
        const founded: GameInterface = this.getGame(uuid);
        if (founded) {
            founded.ready(user);
        }
    }

    pivotGame(data: any, user: PlayerItem): void {
        const founded: GameInterface = this.getGame(data.uuid);
        if (founded) {
            founded.pivot(data, user);
        }
    }

    leaveGamesByUser(user: UserItem): void {
        const games: GameInterface[] = this.games.filter((game: GameInterface) =>
            game.slots.find((player: PlayerInterface) => player.uuid === user.uuid));
        games.forEach((game: GameInterface) => {
            game.slots = game.slots.filter((player: PlayerInterface) => player.uuid !== user.uuid);
            user.socket.leave(game.uuid);
            game.softStop();
        });
        if (games.length) {
            this.io.emit('games:update', games);
        }
    }

    addGame(options: any): GameInterface {
        const game: GameInterface = new Game(this, options);
        this.games.push(game);
        this.io.emit('games:add', game);
        return game;
    }

    removeGame(uuid: string, user: PlayerItem): boolean {
        const founded: GameInterface = this.getGame(uuid);
        if (founded && founded.creator.uuid === user.uuid) {
            founded.stop();
            this.games.splice(this.games.indexOf(founded), 1);
            this.io.emit('games:remove', [founded.uuid]);
            return true;
        } else {
            return false;
        }
    }

    getUserByName(name: string): UserItem {
        return this.users.find((user: UserItem) => user.name === name);
    }
}

export default new App();
