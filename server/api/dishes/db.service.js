/* jshint esversion: 6 */
import knex from '../../common/knex';

class DishDatabase {
    dishQuantitySubtract(uid, dishId) {
        return knex.select('u.id', 'u.user_id', 'd.id')
            .from('dishes AS d')
            .innerJoin('users AS u', 'd.user_id', 'u.id')
            .where({ 'u.user_id': uid, 'd.id': dishId })
            .then(rows => {
                const result = rows.length ? knex('dishes').where({ id: dishId }).update({
                    dish_quantity: knex.raw('?? - 1', ['dish_quantity']),
                }) : Promise.resolve([]);
                return result;
            });
    }
    dishQuantityAdd(uid, dishId) {
        return knex.select('u.id', 'u.user_id', 'd.id')
            .from('dishes AS d')
            .innerJoin('users AS u', 'd.user_id', 'u.id')
            .where({ 'u.user_id': uid, 'd.id': dishId })
            .then(rows => {
                const result = rows.length ? knex('dishes').where({ id: dishId }).update({
                    dish_quantity: knex.raw('?? + 1', ['dish_quantity']),
                }) : Promise.resolve([]);
                return result;
            });
    }
    dishRequestRecieved(uid) {
        const whithinAnHour = new Date(Date.now() - 3600000);
        return knex.select('uFrom.id AS buyer_uid', 'uFrom.display_name as buyer_name', 'uFrom.email as buyer_email', 'd.dish_name', 'd.dish_images', 'd.dish_price', 'd.dish_name', 'o.id as order_id')
            .from('orders AS o')
            .innerJoin('dishes AS d', 'o.dish_id', 'd.id')
            .innerJoin('users AS u', 'd.user_id', 'u.id')
            .innerJoin('users AS uFrom', 'o.user_id', 'uFrom.id')
            .where({ 'u.user_id': uid })
            .where('o.requested_at', '>=', whithinAnHour);
    }
    dishRequestSent(uid) {
        const whithinAnHour = new Date(Date.now() - 3600000);
        return knex.select('uFrom.id as seller_uid', 'uFrom.display_name as seller_name', 'uFrom.email as seller_email', 'd.dish_name', 'd.dish_images', 'd.dish_price', 'd.dish_name', 'd.id as dish_id', 'o.id as order_id')
            .from('orders AS o')
            .innerJoin('dishes AS d', 'o.dish_id', 'd.id')
            .innerJoin('users AS u', 'o.user_id', 'u.id')
            .innerJoin('users AS uFrom', 'd.user_id', 'uFrom.id')
            .where({ 'u.user_id': uid })
            .where('o.requested_at', '>=', whithinAnHour);
    }
    dishRequestApproval(uid, data) {
        const d = new Date();
        return knex.select('u.id', 'u.user_id', 'd.id', 'o.id')
            .from('orders AS o')
            .innerJoin('dishes AS d', 'o.dish_id', 'd.id')
            .innerJoin('users AS u', 'd.user_id', 'u.id')
            .where({ 'u.user_id': uid, 'o.id': data.orderId, 'o.is_accepted': null, 'o.accepted_declined_at': null })
            .then(rows => {
                const result = rows.length ? knex('orders').where({ id: data.orderId }).update({
                    accepted_declined_at: d,
                    is_accepted: true,
                }) : Promise.resolve([]);
                return result;
            });
    }
    dishRequest(uid, data) {
        const d = new Date();
        const whithinAnHour = new Date(Date.now() - 3600000);
        return knex.select('u.id', 'o.requested_at')
            .from('users AS u')
            .joinRaw('left join orders AS o on u.id = o.user_id and o.requested_at >= ?', [whithinAnHour])
            .where({ 'u.user_id': uid })
            .then(rows => {
                const result = rows.length ? knex('orders').insert({
                    user_id: rows[0].id,
                    dish_id: data.dishId,
                    requested_at: rows[0].requested_at || d,
                    is_revoked: false,
                }) : Promise.resolve([]);
                return result;
            });
    }
    search(data) {
        const query = knex.select().from('dishes').where('visibility_duration', '>', knex.fn.now())
            .whereRaw('ACOS(SIN(RADIANS(?)) * SIN(RADIANS(location_lat)) + COS(RADIANS(?)) * COS(RADIANS(location_lat)) * COS(RADIANS(location_long - ?))) * 3959 < ?', [data.location_lat, data.location_lat, data.location_long, data.search_radius]);
        if (data.price_min) {
            query.where('dish_price', '>=', data.price_min);
        }
        if (data.price_max) {
            query.where('dish_price', '<=', data.price_max);
        }
        if (data.dish_ingredients) {
            query.whereRaw('dish_ingredients::text like ?', `%${data.dish_ingredients}%`);
        }
        if (data.dish_type) {
            query.where('dish_type', 'like', `%${data.dish_type}%`);
        }
        if (data.dish_name) {
            query.where('dish_name', 'like', `%${data.dish_name}%`);
        }
        if (data.search_query) {
            query.where(() => {
                this.whereRaw('dish_ingredients::text like ?', `%${data.search_query}%`)
                    .orWhere('dish_type', 'like', `%${data.search_query}%`)
                    .orWhere('dish_name', 'like', `%${data.search_query}%`);
            });
        }
        return query;
    }
    getAllUserDishes(userId) {
        return knex.select('id').from('users').where({ user_id: userId }).then(rows => {
            const result = rows.length ? knex.select().from('dishes').where({ user_id: rows[0].id }) : Promise.resolve([]);
            return result;
        });
    }
    changeDishVisibility(id, userId, visibilityDuration) {
        return knex.select('id').from('users').where({ user_id: userId }).then(rows => {
            const result = rows.length ? knex('dishes').where({ id, user_id: rows[0].id }).update({ visibility_duration: visibilityDuration }) : Promise.resolve([]);
            return result;
        });
    }
    deleteById(id, userId) {
        return knex.select('id').from('users').where({ user_id: userId }).then(rows => {
            const result = rows.length ? knex('dishes').where({ id, user_id: rows[0].id }).del() : Promise.resolve([]);
            return result;
        });
    }

    create(data) {
        return knex.select('id').from('users').where({ user_id: data.user_id }).then(rows => {
            const dataCopy = data;
            dataCopy.user_id = rows[0].id;
            const result = rows.length ? knex('dishes').insert(dataCopy) : Promise.resolve([]);
            return result;
        });
    }
}

export default new DishDatabase();
