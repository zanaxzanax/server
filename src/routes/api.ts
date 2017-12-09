import app from '../classes/app';
import errors from './../errors';
import middlewares from './middlewares';
import * as formidable from 'express-formidable';
import * as _ from 'lodash';

const success = {
    ok: true
};

export default {
    init: (exp) => {

        exp.get('/api/game/:uuid', middlewares.auth, (req, res) => {
            res.json(app.getGame(req.params.uuid));
        });

        exp.get('/api/game', middlewares.auth, (req, res) => {
            res.json(app.getGames());
        });

        exp.get('/api/user', middlewares.auth, (req, res) => {
            res.json(req.user);
        });

        exp.post('/api/game', middlewares.auth, formidable(), (req, res, next) => {
            const game = app.addGame
            (_.extend({}, req.fields, {user: req.user}));
            if (game) {
                res.redirect(`/game/${game.uuid}`);
            } else {
                return next(new errors.BadError());
            }
        });

        exp.delete('/api/game/:uuid', middlewares.auth, (req, res, next) => {
            if (app.removeGame(req.params.uuid, req.user)) {
                return res.json(success);
            } else {
                return next(new errors.BadError());
            }
        });
    }
};
