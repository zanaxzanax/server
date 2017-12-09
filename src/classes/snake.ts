import {
    BodyPointInterface,
    GameInterface,
    GoodPointInterface,
    HeadPointInterface,
    PivotPointInterface,
    PointInterface,
    SnakeInterface,
    SnakeItem,
    SnakeOptions
} from '../types';
import HeadPoint from './points/head-point';
import BodyPoint from './points/body-point';
import * as _ from 'lodash';
import {PivotPointType} from './enums';

export default class Snake implements SnakeInterface {

    static defaults: SnakeOptions = {
        length: 1,
        startX: 0,
        startY: 0,
        direction: PivotPointType.RIGHT,
    };

    options: SnakeOptions;
    head: HeadPointInterface[] = [];
    body: BodyPointInterface[] = [];

    constructor(public game: GameInterface, options: SnakeOptions) {
        this.options = _.extend({}, Snake.defaults, options);
        this.head = [new HeadPoint(this, {
            x: this.options.startX,
            y: this.options.startY,
            direction: this.options.direction
        })];
    }

    get headPoint(): HeadPointInterface {
        return this.head[0];
    }

    get lastPoint(): BodyPointInterface {
        return this.points[this.points.length - 1];
    }

    get points(): BodyPointInterface[] {
        return [...this.head, ...this.body];
    }

    isSelfHit(): boolean {
        return !!this.points.find((point: PointInterface) =>
            !!this.points.find((p: PointInterface) => p !== point && p.x === point.x && p.y === point.y));
    }

    grow(): void {

        let x: number = this.lastPoint.x;
        let y: number = this.lastPoint.y;

        switch (this.lastPoint.direction) {
            case PivotPointType.UP:
                y += 1;
                break;
            case PivotPointType.DOWN:
                y -= 1;
                break;
            case PivotPointType.LEFT:
                x += 1;
                break;
            case PivotPointType.RIGHT:
                x -= 1;
                break;
            default:
                break;
        }

        this.body.push(new BodyPoint(this, x, y, this.lastPoint.direction));
    }

    move(): void {

        const pivots: PivotPointInterface[] = this.game.pivots;
        const good: GoodPointInterface = this.game.good;
        let direction/*: PivotPointType = this.headPoint.direction*/;

        this.points.forEach((point: BodyPointInterface, i: number, array: BodyPointInterface[]) => {

            const pivot: PivotPointInterface = pivots.find((pivotPoint: PivotPointInterface) => {
                return pivotPoint.x === point.x && pivotPoint.y === point.y
            });

            direction = pivot ? pivot.direction : point.direction;
            point.direction = direction;

            switch (direction) {
                case PivotPointType.UP:
                    point.y -= 1;
                    break;
                case PivotPointType.DOWN:
                    point.y += 1;
                    break;
                case PivotPointType.LEFT:
                    point.x -= 1;
                    break;
                case PivotPointType.RIGHT:
                    point.x += 1;
                    break;
                default:
                    break;
            }

            if (point instanceof HeadPoint) {
                if (point.x === good.x && point.y === good.y) {
                    good.eat();
                    //  this.grow();
                    // array.push(this.lastPoint);
                }
            }

        });

        if (good.isEaten()) {
            this.grow();
            console.log('grow:', this.points.length);
        }
    }

    toJSON(): SnakeItem {
        return {
            points: this.points
        }
    }
}
