/* jshint esversion: 6 */
import { Joi } from 'celebrate';
import DatabaseService from './db.service';
import FileUploadService from './upload.service';
import l from '../../common/logger';

export class Controller {
    getCurrentUserInfo(req, res) {
        l.info(`Get Controller.getCurrentUserInfo:${req.user.info.uid}`);
        DatabaseService.getFullUserInfo(req.user.info.uid)
            .then(data => {
                res.status(200).json({ userInfo: data[0] });
            }).catch(err => {
                l.info(`ErrorWhileGettingUserInfo: ${err}`);
                res.boom.badImplementation('ErrorWhileGettingUserInfo');
            });
    }
    getUserProfileInfo(req, res) {
        l.info(`Get Controller.getUserProfileInfo:${req.params.userId}`);
        DatabaseService.getUserInfo(req.params.userId)
            .then(data => {
                res.status(200).json({ userInfo: data[0] });
            }).catch(err => {
                l.info(`ErrorWhileGettingUserInfo: ${err}`);
                res.boom.badImplementation('ErrorWhileGettingUserInfo');
            });
    }
    updateProfile(req, res) {
        l.info(`Get Controller.getUserProfileInfo:${req.params.userId}`);
        const displayPic = [];
        const backgroundPic = [];
        if (req.files.dispayPic) {
            displayPic.push(req.files.dispayPic);
        }
        if (req.files.backgroundPic) {
            backgroundPic.push(req.files.backgroundPic);
        }

        FileUploadService.upload(req.user.info.uid, displayPic)
            .then(data => {
                if (data.allFiles.length) {
                    req.body.dispay_pic = data.allFiles[0];
                }
                FileUploadService.upload(req.user.info.uid, backgroundPic);
            }).then(data => {
                if (data.allFiles.length) {
                    req.body.background_pic = data.allFiles[0];
                }
                req.body.user_id = req.user.info.uid;
                return DatabaseService.updateProfile(req.body);
            }).then(data => {
                l.info(`UserProfileUpdated: ${data.rowCount} row(s) updated`);
                res.status(200).json({ message: 'User Profile sucessully updated' });
            }).catch(err => {
                l.info(`ErrorWhileUdpatingUserProfile: ${err}`);
                res.boom.badImplementation('ErrorWhileUdpatingUserProfile');
            });
    }
    getUserProfileSchema() {
        return {
            params: {
                userId: Joi.number().required(),
            },
        };
    }
}
export default new Controller();
