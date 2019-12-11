var jwt = require('jsonwebtoken');
var keys = require('../../config/keys');

var supperSeceret = keys.supperSeceret;

module.exports = function (app, express, passport) {

    var createToken = function (auth) {
        return jwt.sign({
            id: auth.id
        }, supperSeceret,
            {
                expiresIn: 10 * 100
            });
    };

    var generateToken = function (req, res, next) {
        req.token = createToken(req.auth);
        next();
    };

    var sendToken = function (req, res) {

        res.setHeader('x-auth-token', req.token);
        console.log('x-auth-token', res.get('x-auth-token'));
        res.status(200).send(req.token);
    };

    var authRouter = express.Router();

    // Đăng nhập bằng google
    authRouter.route('/google')
        .post(passport.authenticate('google-token', { session: false }), function (req, res, next) {
            if (!req.user) {
                return res.send(401, 'User Not Authenticated');
            }
            // prepare token for API
            console.log(req.user.username)
            req.auth = {
                id: req.user.id
            };
            next();
        }, generateToken, sendToken);



    authRouter.route('/facebook')
        .post(passport.authenticate('facebook-token', { session: false }), function (req, res, next) {
            console.log(req);
            if (!req.user) {
                return res.send(401, 'User Not Authenticated');
            }
            // prepare token for API
            req.auth = {
                id: req.user.id
            };
            next();
        }, generateToken, sendToken);

    authRouter.get('/logout', function (req, res) {
        req.logout();
        res.status(200);
    });

    return authRouter;
}
