import Point from './point';
import {BodyPointInterface, PointItem, SnakeInterface} from '../../types';

export default class BodyPoint extends Point implements BodyPointInterface {

    constructor(public snake: SnakeInterface, public x: number, public y: number, public direction: number) {
        super(x, y);
    }

    toJSON(): PointItem {
        return {
            x: this.x,
            y: this.y
        }
    }

}
