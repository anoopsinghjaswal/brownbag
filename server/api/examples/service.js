/* jshint esversion: 6 */
import l from '../../common/logger';
import db from './db.service';

class ExamplesService {
    all() {
        l.info(`${this.constructor.name}.all()`);
        return db.all();
    }

    byId(id) {
        l.info(`${this.constructor.name}.byId(${id})`);
        return db.byId(id);
    }

    create(name) {
        return db.insert(name);
    }
}

export default new ExamplesService();
