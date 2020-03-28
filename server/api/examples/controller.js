/* jshint esversion: 6 */
import { Joi } from 'celebrate';
import ExamplesService from './service';

export class Controller {
    all(req, res) {
        ExamplesService.all()
            .then(r => res.json(r));
    }

    byId(req, res) {
        ExamplesService
            .byId(req.params.id)
            .then(r => {
                if (r) res.json(r);
                else res.status(404).end();
            });
    }

    byIdSchema() {
        return {
            params: {
                id: Joi.number().integer().min(1).max(5).required(),
            },
        };
    }

    create(req, res) {
        ExamplesService
            .create(req.body.name)
            .then(r => res
                .status(201)
                .location(`/api/v1/examples/${r.id}`)
                .json(r));
    }
}
export default new Controller();
