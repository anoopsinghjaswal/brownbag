/* jshint esversion: 6 */
import l from './logger';

class AuthenticationService {
    isAuthenticated(req, res, next) {
        /* implement cookie/JWT based authentication for a user
            if a cookie is valid grab user information from db and set add that info in request object
        */
        next();
    }
    loginUser(req, res) {
        /* validate user credentials and set a valid cookie/JWT for user */
        l.info('Login request recieved');
        res.staus(200);
    }
    registerUser(req, res) {
        /* create a user based on information provided by him */
        res.staus(200);
    }
    logoutUser(req, res) {
        /* destory the session if useing cookie authentication or invalidate JWT */
        res.staus(200);
    }
}

export default new AuthenticationService();
