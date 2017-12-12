import middlewares from './middlewares';
import * as jwt from 'jsonwebtoken';
import app from '../classes/app';
import errors from './../errors';
import * as uuid from 'uuid';
import config from './../config';
import * as _ from 'lodash';
import {GameTypes} from '../classes/enums';

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
                name: 'switch',
                typeSingle: GameTypes[GameTypes.SINGLE],
                typeMultiplayer: GameTypes[GameTypes.MULTIPLAYER],
            });
        });

        exp.post('/switch', middlewares.auth, (req, res, next) => {
            switch (req.body.type) {
                case GameTypes[GameTypes.MULTIPLAYER]:
                    return res.redirect('/list');
                case GameTypes[GameTypes.SINGLE]:
                    return res.redirect('/create');
                default:
                    return next(new errors.RouteError());
            }
        });

        exp.get('/list', middlewares.auth, (req, res) => {
            res.render('list', {
                title: `Список игр - ${config.clientName}`,
                clientName: config.clientName,
                name: 'list',
                type: GameTypes[GameTypes.MULTIPLAYER]
            });
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

        exp.get('/create', middlewares.auth, (req, res, next) => {
            return res.render('create', {
                title: `Создание игры - ${config.clientName}`,
                clientName: config.clientName,
                type: GameTypes[GameTypes.SINGLE]
            });
        });

        exp.get('/game/:uuid', middlewares.auth, (req, res, next) => {
            const game: any = app.getGame(req.params.uuid);
            if (game) {
                switch (game.type) {
                    case GameTypes.SINGLE:
                        return res.render('single', {
                            title: `Игра - ${config.clientName}`,
                            clientName: config.clientName,
                            name: 'single',
                        });
                    default:
                        return res.render('multiplayer', {
                            title: `Игра - ${config.clientName}`,
                            clientName: config.clientName,
                            name: 'multiplayer',
                        });
                }
            } else {
                return next(new errors.RouteError());
            }
        });
    }
};
