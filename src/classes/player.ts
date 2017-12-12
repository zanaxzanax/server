import {GameInterface, PlayerInterface, PlayerItem, PlayerOptions} from '../types';
import {PlayerState} from './enums';

export default class Player implements PlayerInterface {

    uuid: string;
    name: string;

    private _state: number = PlayerState.NOT_READY;

    constructor(public game: GameInterface, options: PlayerOptions) {
        this.uuid = options.uuid;
        this.name = options.name;
    }

    set state(value: number) {
        this._state = value;
        this.game.sendUpdateMessage();
    }

    get state(): number {
        return this._state;
    }

    setState(value: number): void {
        this._state = value;
    }

    isReady(): boolean {
        return this.state === PlayerState.READY;
    }

    isLoser(): boolean {
        return this.state === PlayerState.LOSER;
    }

    isWinner(): boolean {
        return this.state === PlayerState.WINNER;
    }

    toJSON(): PlayerItem {
        return {
            name: this.name,
            uuid: this.uuid,
            state: this.state
        }
    }
}
