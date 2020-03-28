/* jshint esversion: 6 */
import * as express from 'express';
import { celebrate } from 'celebrate';
import controller from './controller';

export default express
    .Router()
    .get('/:file', celebrate(controller.getFileSchema()), controller.getFile);
