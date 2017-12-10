import Point from './point';
import {GameInterface, PivotPointInterface, PointItem} from '../../types';
import {PivotPointType} from '../enums';

export class PivotPoint extends Point implements PivotPointInterface {

    x: number;
    y: number;
    direction: number;

    constructor(public game: GameInterface, options: PointItem) {
        super(options.x, options.y);
        this.x = options.x;
        this.y = options.y;
        this.direction = options.direction;
    }

    isUp(): boolean {
        return this.direction === PivotPointType.UP;
    }

    isDown(): boolean {
        return this.direction === PivotPointType.DOWN;
    }

    isLeft(): boolean {
        return this.direction === PivotPointType.LEFT;
    }

    isRight(): boolean {
        return this.direction === PivotPointType.RIGHT;
    }

    isOpposite(direction: PivotPointInterface): boolean {
        return this.isUp() && direction.isDown() || this.isDown() && direction.isUp() ||
            this.isLeft() && direction.isRight() || this.isRight() && direction.isLeft();
    }

    toJSON(): PointItem {
        return {
            x: this.x,
            y: this.y,
            direction: this.direction
        }
    }
}
