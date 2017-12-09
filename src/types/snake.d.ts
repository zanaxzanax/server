import {BodyPointInterface, HeadPointInterface, PointItem} from './point';
import {GameInterface} from './game';

export interface SnakeOptions {
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
    options: SnakeOptions;
    head: HeadPointInterface[];
    body: BodyPointInterface[];
    headPoint: HeadPointInterface;
    lastPoint: BodyPointInterface;
    points: BodyPointInterface[];
    isSelfHit: () => boolean;
    grow: () => void;
    move: () => void;
    toJSON: () => SnakeItem;
}
