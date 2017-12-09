import BodyPoint from './body-point';
import {HeadPointInterface, HeadPointOptions, PointItem, SnakeInterface} from '../../types';

export default class HeadPoint extends BodyPoint implements HeadPointInterface {

    x: number;
    y: number;
    direction: number;

    constructor(public snake: SnakeInterface, options: HeadPointOptions) {

        super(snake, options.x, options.y, options.direction);

        this.x = options.x;
        this.y = options.y;
        this.direction = options.direction;
    }

    toPoint(): PointItem {
        return this.toJSON();
    }

    toJSON(): PointItem {
        return {
            x: this.x,
            y: this.y,
            direction: this.direction
        }
    }

}
