/* jshint esversion: 6 */
import { Joi } from 'celebrate';
import DatabaseService from './db.service';
import FileUploadService from './upload.service';
import l from '../../common/logger';

export class Controller {
    dishQuantitySubtract(req, res) {
        l.info(`Controller.dishQuantitySubtract(${req.user.info.uid},${req.params.dishId})`);
        DatabaseService
            .dishQuantitySubtract(req.user.info.uid, req.params.dishId)
            .then(() => {
                res.json({ msg: 'Dish Quantity Updated' });
            });
    }
    dishQuantityAdd(req, res) {
        l.info(`Controller.dishQuantityAdd(${req.user.info.uid},${req.params.dishId})`);
        DatabaseService
            .dishQuantityAdd(req.user.info.uid, req.params.dishId)
            .then(() => {
                res.json({ msg: 'Dish Quantity Updated' });
            });
    }
    dishRequestSent(req, res) {
        l.info(`Controller.dishRequestSent(${req.user.info.uid})`);
        DatabaseService
            .dishRequestSent(req.user.info.uid)
            .then(r => {
                res.json({ data: r });
            });
    }
    dishRequestRecieved(req, res) {
        l.info(`Controller.dishRequestRecieved(${req.user.info.uid})`);
        DatabaseService
            .dishRequestRecieved(req.user.info.uid)
            .then(r => {
                res.json({ data: r });
            });
    }
    dishRequestApproval(req, res) {
        l.info(`Controller.dishRequestApproval(${req.params.orderId},${req.params.decision})`);
        DatabaseService
            .dishRequestApproval(req.user.info.uid, req.params)
            .then(() => {
                res.json({ data: 'Decision Updated' });
            });
    }
    dishRequestApprovalSchema() {
        return {
            params: {
                orderId: Joi.number().required(),
                decision: Joi.boolean().required(),
            },
        };
    }
    dishRequest(req, res) {
        l.info(`Controller.dishRequest(${req.params.dishId})`);
        DatabaseService
            .dishRequest(req.user.info.uid, req.params)
            .then(() => {
                res.json({ data: 'Dish Request Sent' });
            }).catch(err => {
                // checking user duplicate dish order creation violation
                if (err.code !== '23505') {
                    l.info(`Controller.dishRequest: ${err.message}`);
                    res.boom.badImplementation(err ? err.message : 'Dish request Error');
                }
                res.boom.conflict('Dish is already requested try after an hour');
            });
    }
    dishRequestSchema() {
        return {
            params: {
                dishId: Joi.number().required(),
            },
        };
    }
    search(req, res) {
        l.info(`Controller.search(${req.query.location_lat},${req.query.location_long})`);
        DatabaseService
            .search(req.query)
            .then(r => {
                res.json({ data: r });
            });
    }

    searchSchema() {
        return {
            query: {
                location_lat: Joi.number().precision(7).required(),
                location_long: Joi.number().precision(7).required(),
                price_min: Joi.number().required().optional().default(0),
                price_max: Joi.number().greater(Joi.ref('price_min')).required().optional(),
                dish_ingredients: Joi.string().required().optional(),
                dish_type: Joi.string().required().optional(),
                dish_name: Joi.string().required().optional(),
                search_query: Joi.string().required().optional(),
                search_radius: Joi.number().min(process.env.APP_SEARCH_RADIUS_MIN || 1)
                    .max(process.env.APP_SEARCH_RADIUS_MAX || 10).required()
                    .optional().default(process.env.APP_SEARCH_RADIUS || 2),
            },
        };
    }
    getAllUserDishes(req, res) {
        DatabaseService
            .getAllUserDishes(req.user.info.uid)
            .then(r => {
                res.json({ data: r });
            });
    }
    chnageVisibilitySchema() {
        return {
            params: {
                id: Joi.number().required(),
                duration: Joi.number().integer().required(),
            },
        };
    }
    changeDishVisibility(req, res) {
        DatabaseService
            .changeDishVisibility(req.params.id, req.user.info.uid,
                new Date(Date.now() + (req.params.duration * 3600000)))
            .then(() => {
                res.json({ message: 'dish visibility updated' });
            });
    }
    deleteByIdSchema() {
        return {
            params: {
                id: Joi.number().required(),
            },
        };
    }
    deleteDish(req, res) {
        DatabaseService
            .deleteById(req.params.id, req.user.info.uid)
            .then(() => {
                res.json({ message: 'dish sucessfully deleted' });
            });
    }
    upload(req, res) {
        //  console.log('data from request', req.user.info, req.body, req.files.dish_images, Array.isArray(req.files.dish_images));
        let files = Array
            .isArray(req.files.dish_images) ? req.files.dish_images : [req.files.dish_images];
        files = files[0] === undefined ? [] : files;

        FileUploadService.upload(req.user.info.uid, files).then(data => {
            req.body.user_id = req.user.info.uid;
            req.body.dish_images = JSON.stringify(data.allFiles);
            return DatabaseService.create(req.body);
        }).then(data => {
            l.info(`DataAddedtoDB: ${data.rowCount} row(s) updated`);
            res.status(200).json({ message: 'dish sucessully added' });
        }).catch(err => {
            l.info(`ErrorWhileUploadingtoS3: ${err}`);
            res.boom.badImplementation('terrible implementation');
        });
    }
    uploadSchema() {
        return {
            body: {
                location_lat: Joi.number().precision(7).required(),
                location_long: Joi.number().precision(7).required(),
                dish_price: Joi.number().required(),
                dish_ingredients: Joi.string().required().optional(),
                dish_type: Joi.string().required().optional(),
                dish_name: Joi.string().required(),
                description: Joi.string().required().optional(),
                dish_quantity: Joi.number().optional(),
                currency: Joi.string().max(process.env.APP_DISH_CURRENCY_CHAR_MAX || 4)
                    .required().optional(),
                visibility_duration: Joi.date().timestamp().required().optional()
                    .default(new Date(Date.now() +
                        (process.env.APP_DISH_VISIBILITY_DURATION || 86400000))),
                dish_images: Joi.any(),
            },
        };
    }
}
export default new Controller();
