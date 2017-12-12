import * as uuid from 'uuid/v1';
import Player from './player';
import {
    AppInterface,
    BodyPointInterface,
    GameInterface,
    GameItem,
    GameOptions,
    GoodPointInterface,
    PivotPointInterface,
    PlayerInterface,
    PlayerItem,
    PointItem,
    SnakeInterface
} from '../types';
import config from '../config';
import Snake from './snake';
import {GameRule, GameState, GameTypes, PivotPointType, PlayerState} from './enums';
import GoodPoint from './points/good-point';
import {PivotPoint} from './points';
import * as moment from 'moment';
import * as _ from 'lodash';

export default class Game implements GameInterface {

    static gameDuration: number = config.gameDuration || 60;

    fieldResolutionX: number = config.fieldResolutionX;
    fieldResolutionY: number = config.fieldResolutionY;
    uuid: string = uuid();
    type: number = GameTypes.MULTIPLAYER;
    name: string;
    speed: number;
    rule: number;
    startTime: number;
    now: number;
    endTime: number;
    creator: PlayerInterface;
    playersLimit: number = 2;
    slots: PlayerInterface[] = [];
    pivots: { [key: string]: PivotPointInterface[] } = {};
    snakes: { [key: string]: SnakeInterface } = {};
    goods: { [key: string]: GoodPointInterface } = {};

    private _state: number = GameState.CREATED;
    private _interval;

    constructor(public app: AppInterface, options: GameOptions) {
        this.uuid = uuid();
        this.name = options.name || `name${Date.now()}`;
        this.speed = parseInt(options.speed, 10) || 1;
        this.rule = parseInt(options.rule, 10) || GameRule.WALL_THROW;
        this.creator = new Player(this, options.user);
        this.playersLimit = 2;
    }

    set state(value: number) {
        this._state = value;
        this.sendUpdateMessage();
    }

    get state(): number {
        return this._state;
    }

    get maxX(): number {
        return this.fieldResolutionX - 1;
    }

    get maxY(): number {
        return this.fieldResolutionY - 1;
    }

    sendUpdateMessage(): void {
        this.app.io.to(this.uuid).emit('games:update', [this]);
    }

    isFull(): boolean {
        return this.slots.length === this.playersLimit;
    }

    isInPlay(): boolean {
        return this.state === GameState.PLAY;
    }

    isCreated(): boolean {
        return this.state === GameState.CREATED;
    }

    isDone(): boolean {
        return this.state === GameState.DONE;
    }

    join(user: PlayerItem): boolean {
        if (!this.isFull() && this.isCreated() && !this._getPlayerByUUID(user.uuid)) {
            this.slots.push(new Player(this, user));
            return true;
        } else {
            return false;
        }
    }

    ready(user: PlayerItem): void {
        const player = this._getPlayerByUUID(user.uuid);
        if (player) {
            player.state = PlayerState.READY; // READY;
            if (this._allReady()) {
                this._start();
            }
        }
    }

    pivot(data: PointItem, user: PlayerItem): void {
        if (this._getPlayerByUUID(user.uuid) && this.isInPlay()) {
            this.pivots[user.uuid] = this.pivots[user.uuid] || [];
            this.pivots[user.uuid].push(new PivotPoint(this, {
                x: this.snakes[user.uuid].headPoint.x,
                y: this.snakes[user.uuid].headPoint.y,
                direction: data.direction
            }));
        }
    }

    softStop(): void {
        this._state = GameState.CREATED;
        this.endTime = Date.now();
        this._stopMovement();
    }

    stop(): void {
        this.softStop();
        this._state = GameState.DONE;
    }

    toJSON(): GameItem {
        return {
            name: this.name,
            playersLimit: this.playersLimit,
            speed: this.speed,
            slots: this.slots,
            startTime: this.startTime,
            now: this.now,
            endTime: this.endTime,
            state: this.state,
            goods: this.goods,
            creator: this.creator,
            snakes: this.snakes,
            uuid: this.uuid
        }
    }

    private _allReady(): boolean {
        return this.isFull() && this.slots.every((player) => player.state === 1);
    }

    private _getPlayerByUUID(uuid: string): PlayerInterface {
        return this.slots.find((player: PlayerInterface) => player.uuid === uuid);
    }

    private _checkGoods(): void {
        Object.keys(this.goods).forEach((playerUUID: string) => {
            const good: GoodPointInterface = this.goods[playerUUID];
            if (!good || good.isEaten()) {
                this.goods[playerUUID] = this._createGood();
            }
        });
    }

    private _cleanPivots(): void {
        Object.keys(this.pivots).forEach((playerUUID: string) => {
            const pivots: PointItem[] = this.pivots[playerUUID].slice();
            const snakePoints: BodyPointInterface[] = this.snakes[playerUUID].points;
            this.pivots[playerUUID].length = 0;
            pivots.forEach((pivot: PivotPoint) => {
                if (snakePoints.find((point: BodyPointInterface) => point.x === pivot.x && point.y === pivot.y)) {
                    this.pivots[playerUUID].push(pivot);
                }
            });
        });
    }

    private _moveSnakes(): void {
        Object.keys(this.snakes).forEach((playerUUID: string) => {
            this.snakes[playerUUID].move(this.pivots[playerUUID], this.goods[playerUUID]);
        });
    }

    private _start(): void {

        this.startTime = Date.now();
        this.endTime = Date.now();
        this.now = Date.now();

        this.slots.forEach((slot: PlayerInterface) => {
            const playerUUID: string = slot.uuid;
            this.snakes[playerUUID] = new Snake(this, [{
                x: Math.round(this.fieldResolutionX / 2),
                y: Math.round(this.fieldResolutionY / 2),
                direction: PivotPointType.RIGHT
            }]);
            this.pivots[playerUUID] = [];
            this.goods[slot.uuid] = this._createGood();
        });

        this.state = GameState.PLAY;
        this._startMovement();
    }

    private _isGameOld(secCount: number): boolean {
        return this.isInPlay() && moment.utc(this.now).diff(moment.utc(this.startTime), 'seconds') >= secCount;
    }

    private _checkLosers(): void {
        const uuidArray: string[] = Object.keys(this.snakes).filter((playerUUID: string) => {
            const snake: SnakeInterface = this.snakes[playerUUID];
            return (this.rule === GameRule.SIMPLE && snake.headPoint.x > this.maxX ||
                snake.headPoint.y > this.maxY ||
                snake.headPoint.y < 0 || snake.headPoint.x < 0) ||
                snake.isSelfHit();
        });
        uuidArray.forEach((uuid: string) => {
            this._getPlayerByUUID(uuid).setState(PlayerState.LOSER);
        });
    }

    private _hasLosers(): boolean {
        return !!this.slots.find((player: PlayerInterface) => player.isLoser());
    }

    private _checkWinners(): void {
        let lenArray: any[] = Object.keys(this.snakes).map((playerUUID: string) => ({
            playerUUID,
            len: this.snakes[playerUUID].length()
        }));
        const max: number = _.maxBy(lenArray, (item) => item.len);
        lenArray = lenArray.filter((num) => num === max);
        lenArray.forEach((item) => {
            this._getPlayerByUUID(item.playerUUID).setState(PlayerState.WINNER);
        });
    }

    private _tick(): void {

        this.now = Date.now();

        this._checkGoods();
        this._moveSnakes();
        this._cleanPivots();

        this._checkLosers();

        if (this._hasLosers()) {
            this.stop();
        } else {
            if (this._isGameOld(Game.gameDuration)) {
                this._checkWinners();
                this.stop();
            }
        }

        this.sendUpdateMessage();
    }

    private _randomInteger(min, max): number {
        let rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
    }

    private _getRandomX(): number {
        return this._randomInteger(0, this.maxX);
    }

    private _getRandomY(): number {
        return this._randomInteger(0, this.maxY);
    }

    private _startMovement() {
        this._interval = setInterval(() => {
            this._tick();
        }, (config.relativeSpeed || 1000) / this.speed);
    }

    private _createGood(): GoodPointInterface {
        return new GoodPoint(this, {x: this._getRandomX(), y: this._getRandomY()});
    }

    private _stopMovement() {
        clearInterval(this._interval);
    }
}
