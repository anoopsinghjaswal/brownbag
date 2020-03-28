/* jshint esversion: 6 */
import * as express from 'express';
import { celebrate } from 'celebrate';
import controller from './controller';

export default express
    .Router()
    .post('/', controller.create)
    .get('/', controller.all)
    .get('/test/check', (req, res) => res.status(201).send('working'))
    .get('/:id', celebrate(controller.byIdSchema()), controller.byId);
