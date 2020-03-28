/* jshint esversion: 6 */
import knex from 'knex';

export default knex({
    client: process.env.RDS_DB_CLIENT,
    connection: {
        host: process.env.RDS_DB_HOST,
        user: process.env.RDS_DB_USER,
        password: process.env.RDS_DB_PASSWORD,
        database: process.env.RDS_DB_NAME,
    },
    debug: process.env.NODE_ENV !== 'production',
    pool: {
        min: Number.parseInt(process.env.RDS_DB_MIN_CONNECTIONS, 10),
        max: Number.parseInt(process.env.RDS_DB_MAX_CONNECTIONS, 10),
    },
    acquireConnectionTimeout: Number.parseInt(process.env.RDS_ACQUIRE_CONNECTION_TIMEOUT, 10),
});
