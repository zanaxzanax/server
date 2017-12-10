import {GameInterface} from './game';

export interface PointInterface {
    x: number;
    y: number;
    toJSON: () => PointItem;
}

export interface PointItem {
    x: number;
    y: number;
    direction?: number;
}

export interface GoodOptions {
    playerUUID: string;
    x: number;
    y: number;
}

export interface HeadPointOptions {
    x: number;
    y: number;
    direction: number;
}

export interface PivotPointInterface extends PointInterface {
    direction: number;
    isUp: () => boolean;
    isDown: () => boolean;
    isLeft: () => boolean;
    isRight: () => boolean;
    isOpposite: (direction: PivotPointInterface) => boolean;
}
/*
export interface HeadPointInterface extends BodyPointInterface {
    toPoint: () => PointItem;
}*/

export interface BodyPointInterface extends PointInterface {
    direction: number;
    game: GameInterface;
}

export interface GoodPointInterface extends PointInterface {
    game: GameInterface;
    eat: () => void;
    isEaten: () => boolean;
    eaten: boolean;
}
