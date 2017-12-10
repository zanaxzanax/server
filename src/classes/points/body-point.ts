import Point from './point';
import {BodyPointInterface, GameInterface, PointItem} from '../../types';

export default class BodyPoint extends Point implements BodyPointInterface {

    x: number;
    y: number;
    direction: number;

    constructor(public game: GameInterface, options: PointItem) {
        super(options.x, options.y);
        this.x = options.x;
        this.y = options.y;
        this.direction = options.direction;
    }

    toJSON(): PointItem {
        return {
            x: this.x,
            y: this.y,
            direction: this.direction
        }
    }

}
