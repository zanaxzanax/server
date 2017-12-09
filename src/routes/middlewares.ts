import * as jwt from 'jsonwebtoken';
import errors from './../errors';
import config from './../config';

export default {
    auth: (req, res, next) => {
        const token = req.cookies['token'];
        if (token) {
            jwt.verify(token, config.jwtSecret, (err, user) => {
                if (err) {
                    return next(new errors.AuthError());
                } else {
                    req.user = user;
                    return next();
                }
            })
        } else {
            return next(new errors.AuthError());
        }
    }
};
