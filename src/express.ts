import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import errors from './errors';
import routes from './routes';
import config from './config';
import * as path from 'path';

const exp = express();

const dirname = process.env.PWD || __dirname;

exp.use(bodyParser.urlencoded({extended: false}));
exp.use(bodyParser.json());
exp.use(cookieParser());
exp.set('view engine', 'ejs');
exp.set('views', path.resolve(dirname, './routes/pages'));

routes.api.init(exp);
routes.pages.init(exp);

exp.use(express.static(dirname + '/public'));

exp.use((req, res, next) => {
    next(new errors.RouteError());
});

const isXMLHttpRequest = (req) => {
    return req.headers && req.headers['X-Requested-With'] === 'XMLHttpRequest';
};

exp.use((err, req, res, next) => {

    const isXML = isXMLHttpRequest(req);

    if (isXML) {
        res.status(err.status || 500);
        return res.json({
            errors: {
                message: err.message,
                error: {}
            }
        });
    } else {
        switch (err.status) {
            case 403:
                return res.redirect('/');
            default:
                return res.render('error', {
                    status: err.status,
                    title: `Ошибка - ${config.clientName}`,
                    clientName: config.clientName,
                    name: 'error'
                });
        }
    }
});

export default {
    start: () => new Promise((resolve, reject) => {
        const server = exp.listen(process.env.PORT);
        server.on('error', reject);
        server.on('listening', () => {
            resolve(server);
        });
    })
};
