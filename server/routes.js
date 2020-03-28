/* jshint esversion: 6 */
import examplesRouter from './api/examples/router';
import dishesRouter from './api/dishes/router';
import usersRouter from './api/users/router';
import ordersRouter from './api/orders/router';
import fileRouter from './api/file/router';
import auth from './common/auth';

export default function routes(app) {
    app.use(`/api/${process.env.API_VERSION}/examples`, [auth.isAuthenticated], examplesRouter);
    app.use(`/api/${process.env.API_VERSION}/dishes`, [auth.isAuthenticated], dishesRouter);
    app.use(`/api/${process.env.API_VERSION}/users`, [auth.isAuthenticated], usersRouter);
    app.use(`/api/${process.env.API_VERSION}/orders`, [auth.isAuthenticated], ordersRouter);
    app.use(`/api/${process.env.API_VERSION}/file`, [auth.isAuthenticated], fileRouter);
    app.use(`/api/${process.env.API_VERSION}/env`, (req, res) => res.json(process.env));
}
