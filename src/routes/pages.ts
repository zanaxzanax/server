import middlewares from './middlewares';
import * as jwt from 'jsonwebtoken';
import app from '../classes/app';
import errors from './../errors';
import * as uuid from 'uuid';
import config from './../config';
import * as _ from 'lodash';

export default {
    init: (exp) => {
        exp.get('/', (req, res) => {
            res.render('main', {
                title: `Главная - ${config.clientName}`,
                clientName: config.clientName,
                name: 'main'
            });
        });

        exp.get('/switch', middlewares.auth, (req, res) => {
            res.render('switch', {
                title: `Тип игры - ${config.clientName}`,
                clientName: config.clientName,
                name: 'switch'
            });
        });

        exp.get('/list', middlewares.auth, (req, res) => {
            res.render('list', {
                title: `Список игр - ${config.clientName}`,
                clientName: config.clientName,
                name: 'list'
            });
        });

        exp.post('/switch', middlewares.auth, (req, res, next) => {
            switch (req.body.type) {
                case 'multiplayer':
                    return res.redirect('/list');
                case 'single':
                    return res.redirect('/game/single');
                default:
                    return next(new errors.RouteError());
            }
        });

        exp.get('/error/:status', (req, res) => {
            res.render('error', {
                status: req.params.status,
                title: `Ошибка - ${config.clientName}`,
                clientName: config.clientName,
                name: 'error'
            });
        });

        exp.post('/auth', (req, res, next) => {
            if (!app.getUserByName(req.body.name)) {
                jwt.sign(_.extend({}, req.body, {uuid: uuid()}), config.jwtSecret, (err, token) => {
                    if (err) {
                        return next(err);
                    } else {
                        res.cookie('token', token, {
                            path: '/',
                            httpOnly: false
                        });
                        return res.redirect('/switch');
                    }
                });
            } else {
                return res.redirect('/');
            }
        });

        exp.get('/game', middlewares.auth, (req, res, next) => {
            return res.render('game', {
                title: `Игра - ${config.clientName}`,
                clientName: config.clientName,
                name: 'game',
                uuid: req.params.uuid
            });
        });

        exp.get('/game/:uuid', middlewares.auth, (req, res, next) => {
            if (app.getGame(req.params.uuid)) {
                return res.render('multiplayer', {
                    title: `Игра - ${config.clientName}`,
                    clientName: config.clientName,
                    name: 'multiplayer',
                    uuid: req.params.uuid
                });
            } else {
                return next(new errors.RouteError());
            }
        });
    }
};
