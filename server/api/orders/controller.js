/* jshint esversion: 6 */
import { Joi } from 'celebrate';
import DatabaseService from './db.service';
import l from '../../common/logger';

export class Controller {
    getAllOrders(req, res) {
        l.info(`Get Controller.getAllOrder: ${req.query.pageNum || 0}`);
        DatabaseService.getAllOrders(req.user.info.uid, req.query.pageNum || 0)
            .then(data => {
                res.status(200).json(data);
            }).catch(err => {
                l.info(`ErrorWhileGettingOrderDetail: ${err}`);
                res.boom.badImplementation('ErrorWhileGettingOrderDetail');
            });
    }
    postOrderReview(req, res) {
        l.info(`Get Controller.postOrderReview:${req.params.orderId}`);
        DatabaseService.postOrderReview(req.user.info.uid, req.params.orderId, req.body)
            .then(r => {
                if (r.length) {
                    res.status(200).json({
                        orderNum: req.params.orderId,
                        message: 'Review has been successfully saved',
                    });
                } else {
                    res.boom.badRequest('Cannot Save review for this Order');
                }
            }).catch(err => {
                l.info(`ErrorWhileGettingSavingReviewInfo: ${err}`);
                res.boom.badImplementation('ErrorWhileGettingSavingReviewInfo');
            });
    }
    getAllOrderSchema() {
        return {
            query: {
                pageNum: Joi.number().optional(),
            },
        };
    }
    postOrderReviewSchema() {
        return {
            body: {
                rating: Joi.number().required(),
                comment: Joi.string().optional(),
            },
        };
    }
}
export default new Controller();
