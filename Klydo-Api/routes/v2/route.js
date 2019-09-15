module.exports = (app, express) => {

    let router = express.Router();

    router.get('/user/:id/:friend_id?',loadV2Controller('UserController').getUserDetail);
    router.get('/klyspace-data/fetch/:user_id', loadV2Controller('KlyspaceController').getKlyspaceData);

    router.get('/', (req, res) => {
        res.send('Write the whole URL you lazy ass.');
    });

    app.use('/app/v2', router);

};
