import {PointInterface, PointItem} from '../../types';

export default class Point implements PointInterface {
    constructor(public x: number, public y: number) {

    }

    toJSON(): PointItem {
        return {
            x: this.x,
            y: this.y,
        }
    }

}
