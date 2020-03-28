/* jshint esversion: 6 */
import * as express from 'express';
import { celebrate } from 'celebrate';
import controller from './controller';

export default express
    .Router()
    .post('/', celebrate(controller.uploadSchema()), controller.upload)
    .post('/request/:dishId', celebrate(controller.dishRequestSchema()), controller.dishRequest)
    .put('/quantity/increase/:dishId', celebrate(controller.dishRequestSchema()), controller.dishQuantityAdd)
    .put('/quantity/decrease/:dishId', celebrate(controller.dishRequestSchema()), controller.dishQuantitySubtract)
    .get('/request/sent', controller.dishRequestSent)
    .get('/request/recieved', controller.dishRequestRecieved)
    .put('/request/approval/:orderId/:decision', celebrate(controller.dishRequestApprovalSchema()), controller.dishRequestApproval)
    .get('/', celebrate(controller.searchSchema()), controller.search)
    .get('/history', controller.getAllUserDishes)
    .get('/visibility/:id/:duration', celebrate(controller.chnageVisibilitySchema()), controller.changeDishVisibility)
    .delete('/:id', celebrate(controller.deleteByIdSchema()), controller.deleteDish);
