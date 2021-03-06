import Point from './point';
import {GameInterface, GoodOptions, GoodPointInterface, PointItem} from '../../types';

export default class GoodPoint extends Point implements GoodPointInterface {

    eaten: boolean = false;

    constructor(public game: GameInterface, options: GoodOptions) {
        super(options.x, options.y);
        this.x = options.x;
        this.y = options.y;
    }

    isEaten(): boolean {
        return this.eaten;
    }

    eat(): void {
        this.eaten = true;
    }

    toJSON(): PointItem {
        return {
            x: this.x,
            y: this.y
        }
    }
}
