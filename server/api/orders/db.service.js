/* jshint esversion: 6 */
import knex from '../../common/knex';

class DishDatabase {
    getAllOrders(uid, pageNum) {
        return knex.select('id').from('users').where({ user_id: uid }).then(rows => {
            const result = rows.length ? knex.select().from('orders').where({ user_id: rows[0].id }).offset(pageNum * 50).limit(50) : Promise.resolve([]);
            return result;
        });
    }
    postOrderReview(uid, orderId, data) {
        const d = new Date();
        const insertData = {
            order_id: orderId,
            is_reviewed: true,
            is_active: true,
            order_rating: data.rating,
            created_at: d,
            updated_at: d,
        };
        if (data.comment) {
            insertData.order_comments = data.comment;
        }
        return knex.transaction(trx => trx.select('dish_id')
            .from('orders AS o')
            .innerJoin('users AS u', 'o.user_id', 'u.id')
            .where({ 'o.id': orderId, 'u.user_id': uid, 'o.is_accepted': true, 'o.is_revoked': false, 'o.is_complete': true })
            .then(rows => {
                const dbQueries = [];
                if (rows.length) {
                    dbQueries.push(trx('order_reviews').insert(insertData));
                    dbQueries.push(trx('dishes').where({ id: rows[0].dish_id }).update({
                        order_reviewed_ratings_sum: knex.raw('?? + ?', ['order_reviewed_ratings_sum', data.rating]),
                        order_reviewed_sum: knex.raw('?? + 1', ['order_reviewed_sum']),
                    }));
                }
                return Promise.all(dbQueries);
            }));
    }
}

export default new DishDatabase();
