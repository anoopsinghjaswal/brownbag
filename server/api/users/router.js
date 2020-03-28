/* jshint esversion: 6 */
import * as express from 'express';
import { celebrate } from 'celebrate';
import controller from './controller';

export default express
    .Router()
    .get('/profile', controller.getCurrentUserInfo)
    .get('/profile/:userId', celebrate(controller.getUserProfileSchema()), controller.getUserProfileInfo);
