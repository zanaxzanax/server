import app from '../classes/app';
import errors from './../errors';
import middlewares from './middlewares';
import * as formidable from 'express-formidable';
import * as _ from 'lodash';
import config from './../config';
import {ConfigItem} from '../types/config';

const success = {
    ok: true
};

export default {
    init: (exp) => {

        exp.get('/api/game/:uuid', middlewares.auth, (req, res, next) => {
            const game: any = app.getGame(req.params.uuid);
            if (game) {
                return res.json(game);
            }
            return next(new errors.RouteError());
        });

        exp.get('/api/game', middlewares.auth, (req, res) => {
            res.json(app.getGames());
        });

        exp.get('/api/user', middlewares.auth, (req, res) => {
            res.json(req.user);
        });

        exp.get('/api/config', middlewares.auth, (req, res) => {
            const forSend: ConfigItem = _.extend({}, config);
            delete forSend['jwtSecret'];
            res.json(forSend);
        });

        exp.post('/api/game', middlewares.auth, formidable(), (req, res) => {
            const game = app.addGame(_.extend({}, req.fields, {user: req.user}));
            res.redirect(`/game/${game.uuid}`);
        });

        exp.delete('/api/game/:uuid', middlewares.auth, (req, res, next) => {
            if (app.removeGame(req.params.uuid, req.user)) {
                return res.json(success);
            }
            return next(new errors.BadError());
        });
    }
};
