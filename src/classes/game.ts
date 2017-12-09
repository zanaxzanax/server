import * as uuid from 'uuid/v1';
import * as _ from 'lodash';
import Player from './player';
import {
    AppInterface,
    GameEvent,
    GameInterface,
    GameItem,
    GoodPointInterface,
    PivotPointEventData,
    PivotPointInterface,
    PlayerInterface,
    PointItem,
    SnakeInterface,
    SnakeItem
} from '../types';
import config from '../config';
import Snake from './snake';
import {GameEventType, GameState} from './enums';

export default class Game implements GameInterface {

    fieldResolutionX: number = config.fieldResolutionX;
    fieldResolutionY: number = config.fieldResolutionY;
    uuid: string;
    name: string;
    creator: PlayerInterface;
    playersLimit: number = 2;
    slots: PlayerInterface[] = [];
    events: GameEvent[] = [];
    pivots: PivotPointInterface[] = [];
    good: GoodPointInterface;
    snakes: { [key: string]: SnakeInterface };
    goods: { [key: string]: GoodPointInterface };

    private _state: number;

    constructor(public app: AppInterface, options: any) {
        this.uuid = uuid();
        this.name = options.name;
        this.creator = new Player(this, options.user);
        this.playersLimit = 2;
    }

    set state(value: number) {
        this._state = value;
        this.app.io.to(this.uuid).emit('games:update', [this]);
    }

    get state(): number {
        return this._state;
    }

    isFull(): boolean {
        return this.slots.length === this.playersLimit;
    }

    isInPlay(): boolean {
        return this.state === GameState.PLAY;
    }

    join(user: PlayerInterface): boolean {
        if (!this.isFull() && !this.getPlayerByUUID(user.uuid)) {
            this.slots.push(new Player(this, user));
            return true;
        } else {
            return false;
        }
    }

    allReady(): boolean {
        return this.isFull() && this.slots.every((player) => player.state === 1);
    }

    ready(user: PlayerInterface): void {
        const player = this.getPlayerByUUID(user.uuid);
        if (player) {
            player.state = 1; // READY;
            if (this.allReady()) {
                this.start();
            }
        }
    }

    addEvent(options: any): void {
        // this.events.push(_.extend({}, options, {
        //     ts: Date.now(),
        //     game: this.uuid,
        // }));

        this.app.io.to(this.uuid).emit('games:tick', _.extend({}, options, {
            ts: Date.now(),
            game: this.uuid,
        }));
    }

    pivot(data: PivotPointEventData, user: PlayerInterface): void {
        if (this.getPlayerByUUID(user.uuid) && this.isInPlay()) {
            this.addEvent({
                type: 0,
                player: user.uuid,
                data
            });
        }
    }

    getPlayerByUUID(uuid: string): PlayerInterface {
        return this.slots.find((player: PlayerInterface) => player.uuid === uuid);
    }

    selfDestroy(): void {
        this._state = GameState.DELETED;
        this.stop();
    }

    stop(): void {
        // clearInterval(this._tickInterval);
        // clearInterval(this._moveInterval);
        // this.events.length = 0;
    }

    start(): void {

        this.slots.forEach((slot: PlayerInterface) => {
            this.snakes[slot.uuid] = new Snake(this, {
                startX: Math.round(this.fieldResolutionX / 2),
                startY: Math.round(this.fieldResolutionY / 2)
            });
        });

        this.state = GameState.PLAY;
        this._startMovement();
    }

    tick(): void {
        // this.app.io.to(this.uuid).emit('game:tick', this.events);
        // this.events.length = 0;

        this.addEvent({
            type: GameEventType.TICK
        });
    }

    toJSON(): GameItem {
        return {
            name: this.name,
            slots: this.slots,
            state: this.state,
            goods: this._getGoods(),
            creator: this.creator,
            snakes: this._getSnakes(),
            uuid: this.uuid
        }
    }

    private _getGoods(): PointItem[] {
        return Object.keys(this.goods).map((uuid: string) => this.goods[uuid].toJSON());
    }

    private _getSnakes(): SnakeItem[] {
        return Object.keys(this.snakes).map((uuid: string) => this.snakes[uuid].toJSON());
    }

    private _startMovement() {
        setInterval(() => {
            this.tick();
        }, 1000);
    }
}

// this._tickInterval = setInterval(() => {
//     this.tick();
// }, 2000);
// this._moveInterval = setInterval(() => {
//     this.addEvent({
//         type: 1 // TICK
//     });
// }, 777);
