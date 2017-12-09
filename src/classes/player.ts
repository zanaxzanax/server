import {GameInterface, PlayerInterface, PlayerItem, PlayerOptions} from '../types/index';
import {PlayerState} from './enums';

export default class Player implements PlayerInterface {

    uuid: string;
    name: string;

    private _state: number;

    constructor(public game: GameInterface, options: PlayerOptions) {
        this.uuid = options.uuid;
        this.name = options.name;
        this._state = 0 // NOT_READY;
    }

    set state(value: number) {
        this._state = value;
        this.game.app.io.to(this.uuid).emit('games:update', this.game);
    }

    get state(): number {
        return this._state;
    }

    isReady(): boolean {
        return this.state === PlayerState.READY;
    }

    toJSON(): PlayerItem {
        return {
            name: this.name,
            uuid: this.uuid,
            state: this.state
        }
    }
}
