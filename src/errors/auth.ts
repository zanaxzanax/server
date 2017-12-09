export default class AuthError extends Error {
    status: number;
    constructor() {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.status = 403;
    }
}
