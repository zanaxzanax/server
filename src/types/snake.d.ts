import {BodyPointInterface, PointItem} from './point';
import {GameInterface} from './game';
import {GoodPointInterface, PivotPointInterface} from './index';

export interface SnakeOptions {
    playerUUID: string;
    length?: number;
    startX?: number;
    startY?: number;
    headColor?: string;
    bodyColor?: string;
    direction?: number;
}

export interface SnakeItem {
    points: PointItem[];
}

export interface SnakeInterface {
    game: GameInterface
    headPoint: BodyPointInterface;
    lastPoint: BodyPointInterface;
    points: BodyPointInterface[];
    isSelfHit: () => boolean;
    grow: () => void;
    move: (pivots: PivotPointInterface[], good: GoodPointInterface) => void
    length: () => number;
    toJSON: () => SnakeItem;
}
