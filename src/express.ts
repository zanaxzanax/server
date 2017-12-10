import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import errors from './errors';
import routes from './routes';
import config from './config';
import * as path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

const exp = express();

exp.use(bodyParser.urlencoded({extended: false}));
exp.use(bodyParser.json());
//exp.use(formidable());
exp.use(cookieParser());
exp.set('view engine', 'ejs');
exp.set('views', path.resolve(__dirname, './routes/pages'));

routes.api.init(exp);
routes.pages.init(exp);

exp.use(express.static(__dirname + './../dist/public', {
    fallthrough: true
}));

exp.use((req, res, next) => {
    next(new errors.RouteError());
});
/*
if (!isProduction) {
    exp.use(function (err, req, res, next) {
        console.log(err.stack);

        res.status(err.status || 500);

        res.json({
            'errors': {
                message: err.message,
                error: err
            }
        });
    });
}*/

const isXMLHttpRequest = (req) => {
    return req.headers && req.headers['X-Requested-With'] === 'XMLHttpRequest';
};

exp.use((err, req, res, next) => {

    console.error(err);
    console.error(typeof err);

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
        //console.log(process.env.PORT)
        const server = exp.listen(process.env.PORT);
        server.on('error', reject);
        server.on('listening', (arg) => {
            resolve(server);
        });
    })
};

