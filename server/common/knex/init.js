/* jshint esversion: 6 */
import Promise from 'bluebird';
import knex from './index';


class DbStructureCreateService {
    create() {
        return knex.transaction(trx => // list all the table to be created in the db
            Promise.all([trx.schema.hasTable('users').then(exists => {
                if (exists) return true;
                return trx.schema.createTable('users', t => {
                    t.increments('id').primary();
                    t.string('user_id', 50).notNullable();
                    t.string('display_name', 100).notNullable();
                    t.string('email', 254).notNullable();
                    t.boolean('email_verified');
                    t.string('phone_number', 20);
                    t.boolean('is_anonymous');
                    t.string('status', 240);
                    t.string('display_pic', 100);
                    t.string('background_pic', 100);
                    t.float('user_rating');
                    t.text('description');
                    t.jsonb('device_tokens');
                    t.timestamp('updated_at').defaultTo(knex.fn.now());
                    t.unique('user_id');
                    t.unique('email');
                });
            }), trx.schema.hasTable('dishes').then(exists => {
                if (exists) return true;
                return trx.schema.createTable('dishes', t => {
                    t.increments('id').primary();
                    t.integer('user_id');
                    t.decimal('location_lat', 9, 7);
                    t.decimal('location_long', 10, 7);
                    t.string('dish_name', 100);
                    t.text('description');
                    t.string('dish_type', 100);
                    t.json('dish_images');
                    t.jsonb('dish_ingredients');
                    t.float('dish_price');
                    t.integer('dish_quantity').defaultTo(0).notNullable();
                    t.integer('order_reviewed_ratings_sum').defaultTo(0).notNullable();
                    t.integer('order_reviewed_sum').defaultTo(0).notNullable();
                    t.timestamp('visibility_duration').notNullable();
                    t.timestamps(true, true);
                    t.string('currency', 4).defaultTo('USD');
                    t.foreign('user_id').references('users.id');
                    t.index('location_lat', 'location_lat_index');
                    t.index('location_lat', 'location_long_index');
                    t.index('dish_price', 'dish_price_index');
                });
            }), trx.schema.hasTable('orders').then(exists => {
                if (exists) return true;
                return trx.schema.createTable('orders', t => {
                    t.increments('id').primary();
                    t.integer('user_id');
                    t.integer('dish_id');
                    t.timestamp('requested_at').defaultTo(knex.fn.now());
                    t.boolean('is_revoked');
                    t.boolean('is_timeout').defaultTo(false);
                    t.timestamp('revoked_at');
                    t.boolean('is_accepted');
                    t.boolean('is_sent_for_approval').defaultTo(false).notNullable();
                    t.timestamp('sent_for_approval_at');
                    t.jsonb('payment_details');
                    t.boolean('is_complete').defaultTo(false).notNullable();
                    t.timestamp('accepted_declined_at');
                    t.timestamp('order_completed_at');
                    t.timestamps(true, true);
                    t.foreign('user_id').references('users.id');
                    t.foreign('dish_id').references('dishes.id');
                    t.unique(['user_id', 'dish_id', 'requested_at']);
                });
            }), trx.schema.hasTable('order_reviews').then(exists => {
                if (exists) return true;
                return trx.schema.createTable('order_reviews', t => {
                    t.increments('id').primary();
                    t.integer('order_id');
                    t.boolean('is_reviewed');
                    t.boolean('is_active');
                    t.integer('order_rating');
                    t.text('order_comments');
                    t.timestamp('created_at').defaultTo(knex.fn.now());
                    t.timestamp('updated_at').defaultTo(knex.fn.now());
                    t.foreign('order_id').references('orders.id');
                });
            }), trx.schema.hasTable('chats').then(exists => {
                if (exists) return true;
                return trx.schema.createTable('chats', t => {
                    t.increments('id').primary();
                    t.integer('user_from');
                    t.integer('user_to');
                    t.jsonb('content');
                    t.timestamp('created_at').defaultTo(knex.fn.now());
                    t.timestamp('delivered_at');
                    t.timestamp('read_at');
                    t.foreign('user_from').references('users.id');
                    t.foreign('user_to').references('users.id');
                });
            }), trx.schema.hasTable('notifications').then(exists => {
                if (exists) return true;
                return trx.schema.createTable('notifications', t => {
                    t.increments('id').primary();
                    t.string('topic', 50); // optional
                    t.integer('user_to'); // optional
                    t.jsonb('content');
                    t.timestamp('created_at').defaultTo(knex.fn.now());
                    t.foreign('user_to').references('users.id');
                });
            })]));
    }
}

export default new DbStructureCreateService();
