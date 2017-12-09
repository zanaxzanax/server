import Point from './point';
import {GameInterface, GoodPointInterface, PointItem} from '../../types';

export default class GoodPoint extends Point implements GoodPointInterface {

    eaten: boolean = false;

    constructor(public game: GameInterface, public x: number, public y: number) {
        super(x, y);
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
