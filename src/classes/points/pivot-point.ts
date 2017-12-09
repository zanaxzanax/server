import Point from './point';
import {GameInterface, PivotPointInterface, PointItem} from '../../types';
import {PivotPointType} from '../enums';

export class PivotPoint extends Point implements PivotPointInterface {

    constructor(public game: GameInterface, public x, public y, public direction: number) {
        super(x, y);
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
