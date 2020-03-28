/* jshint esversion: 6 */
import { Joi } from 'celebrate';
import s3 from '../../common/s3bucket';

export class Controller {
    getFile(req, res) {
        const url = s3.preSignedGetobject(req.params.file);
        if (url) {
            res.json({ url });
        } else {
            res.status(404).end();
        }
    }

    getFileSchema() {
        return {
            params: {
                file: Joi.string().required(),
            },
        };
    }
}
export default new Controller();
