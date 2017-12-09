export default class BadError extends Error {
    status: number;

    constructor() {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.status = 400;
    }
}
