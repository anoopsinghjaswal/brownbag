/* jshint esversion: 6 */
import knex from '../../common/knex';

class DishDatabase {
    getFullUserInfo(uid) {
        return knex.select().from('users').where({ user_id: uid });
    }
    getUserInfo(id) {
        return knex.select('id', 'display_name', 'email', 'status', 'description', 'display_pic', 'user_rating')
            .from('users').where({ id });
    }
    updateProfile(data) {
        const d = new Date();
        return knex('users')
            .where({ user_id: data.user_id })
            .update({
                status: data.status,
                display_pic: data.display_pic,
                background_pic: data.background_pic,
                description: data.description,
                updated_at: d,
            });
    }
}

export default new DishDatabase();
