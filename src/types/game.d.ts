import {AppInterface} from './app';
import {GoodPointInterface, PivotPointInterface, PointInterface, PointItem} from './point';
import {PlayerInterface, PlayerItem} from './player';
import {SnakeItem} from './snake';
import {SnakeInterface} from './index';

export interface GameItem {
    name: string;
    state: number;
    playersLimit: number;
    startTime: number;
    endTime: number;
    now: number;
    slots: PlayerItem[];
    snakes: { [key: string]: SnakeItem };
    goods: { [key: string]: PointItem };
    creator: PlayerItem;
    uuid: string;
}

export interface GameOptions {
    name: string;
    speed: string;
    rule: string;
    user: PlayerItem;
}

export interface GameEvent {
    ts: number;
    type: number;
    data: any;
    game?: string;
    player?: string;
}

export interface GameStatistic {
    snakePosition?: PointInterface;
    pastTime?: number;
}

export interface GameInterface {
    app: AppInterface;
    uuid: string;
    name: string;
    speed: number;
    rule: number;
    fieldResolutionX: number;
    fieldResolutionY: number;
    maxX: number;
    maxY: number;
    state: number;
    creator: PlayerInterface;
    playersLimit: number;
    slots: PlayerInterface[];
    pivots: { [key: string]: PivotPointInterface[] };
    snakes: { [key: string]: SnakeInterface };
    goods: { [key: string]: GoodPointInterface };
    isFull: () => boolean;
    isInPlay: () => boolean;
    isDone: () => boolean;
    join: (user: PlayerItem) => boolean;
    allReady: () => boolean;
    ready: (user: PlayerItem) => void;
    pivot: (data: PointItem, user: PlayerItem) => void;
    getPlayerByUUID: (snake: string) => PlayerInterface;
    softStop: () => void;
    stop: () => void;
    start: () => void;
    tick: () => void;
    toJSON: () => GameItem;
    sendUpdateMessage: () => void;
    getPlayerUUIDBySnake: (snake: SnakeInterface) => string;
    hasLosers: () => boolean;
}
