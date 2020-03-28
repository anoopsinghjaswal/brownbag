/* jshint esversion: 6 */
import * as express from 'express';
import { celebrate } from 'celebrate';
import controller from './controller';

export default express
    .Router()
    .get('/', celebrate(controller.getAllOrderSchema()), controller.getAllOrders)
    .post('/review/:orderId', celebrate(controller.postOrderReviewSchema()), controller.postOrderReview);
