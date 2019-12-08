module.exports = (app, express) => {

    let router = express.Router();

    router.get('/user/:id/:friend_id?',loadV2Controller('UserController').getUserDetail);
    router.get('/klyspace-data/fetch/:user_id', loadV2Controller('KlyspaceController').getKlyspaceData);

    router.post('/report-post', loadV2Controller('PostController').reportPost);
    router.post('/report-profile', loadV2Controller('UserController').reportProfile);

    router.get('/', (req, res) => {
        res.send('Write the whole URL you lazy ass.');
    });

    app.use('/sandbox/v2', router);

};
