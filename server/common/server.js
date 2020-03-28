/* jshint esversion: 6 */
import Express from 'express';
import boom from 'express-boom';
import { errors } from 'celebrate';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

import dbSchema from './knex/init';
import l from './logger';

const app = new Express();

export default class ExpressServer {
    constructor() {
        const root = path.normalize(`${__dirname}/../..`);
        app.set('appPath', `${root}client`);
        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(fileUpload());
        app.use(cookieParser(process.env.SESSION_SECRET));
        app.use(Express.static(`${root}/public`));
        app.use(`/api/${process.env.API_VERSION}`, Express.static(`${root}/public`));
        app.use(boom());
        app.use(errors());
    }
    router(routes) {
        routes(app);
        // Error handler to display the validation error as HTML
        app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars, no-shadow
            if (err.isBoom) {
                l.info(`BoomErrorCaptured: ${JSON.stringify(err)}`);
                res.status(err.output.statusCode).json(err.output.payload);
            } else if (err.isJoi) {
                l.info(`JoiValidationError ${err.message}`);
                res.boom.badData(`Validation Error: ${err.message}`);
            } else {
                l.info(`UnhandledError: ${err}`);
                const error = res.boom.create(err.status || 500, err);
                res.status(error.output.statusCode).json(error.output.payload);
            }
        });
        return this;
    }

    listen(port = process.env.PORT || 3000) {
        const welcome = p => () => l.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${p}}`);
        // create db tables before starting the server
        dbSchema.create().then(() => {
            l.info('Table strucure is created in DB');
            http.createServer(app).listen(port, welcome(port));
            return app;
        }).catch(err => l.error(`DbSchemaCreationError: ${JSON.stringify(err)}`));
    }
}
