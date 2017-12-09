import {AppInterface} from './app';
import {GoodPointInterface, PivotPointInterface, PointInterface, PointItem} from './point';
import {PlayerInterface, PlayerItem} from './player';
import {SnakeItem} from './snake';
import {SnakeInterface} from './index';

export interface GameItem {
    name: string;
    state: number;
    slots: PlayerItem[];
    snakes: SnakeItem[];
    goods: PointItem[];
    creator: PlayerItem;
    uuid: string;
}

export interface GameEvent {
    ts: number;
    type: number;
    data: any;
    game?: string;
    player?: string;
}

export interface PivotPointEventData {
    x: number;
    y: number;
    direction: number;
}

export interface GameStatistic {
    snakePosition?: PointInterface;
    pastTime?: number;
}

export interface GameInterface {
    app: AppInterface;
    uuid: string;
    name: string;
    fieldResolutionX: number;
    fieldResolutionY: number;
    state: number;
    creator: PlayerInterface;
    playersLimit: number;
    slots: PlayerInterface[];
    events: GameEvent[];
    pivots: PivotPointInterface[];
    good: GoodPointInterface;
    snakes: { [key: string]: SnakeInterface };
    goods: { [key: string]: GoodPointInterface };
    isFull: () => boolean;
    isInPlay: () => boolean;
    join: (user: PlayerInterface) => boolean;
    allReady: () => boolean;
    ready: (user: PlayerInterface) => void;
    addEvent: (otions: any) => void;
    pivot: (data: PivotPointEventData, user: PlayerInterface) => void;
    getPlayerByUUID: (uuid: string) => PlayerInterface;
    selfDestroy: () => void;
    stop: () => void;
    start: () => void;
    tick: () => void;
    toJSON: () => GameItem;
}
